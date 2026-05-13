import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Define Zod schema for input validation for the grading API.
// Ensures that `studentId`, `assessmentId`, and `score` are present and correctly typed.
const gradeSubmissionSchema = z.object({
  studentId: z.string().min(1, "Student ID is required."),
  assessmentId: z.string().min(1, "Assessment ID is required."),
  score: z.number().min(0).max(100, "Score must be between 0 and 100."),
});

// GET method to retrieve a specific grade for a student and assessment.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const assessmentId = searchParams.get("assessmentId");

  // Validate the presence of studentId and assessmentId.
  if (!studentId || !assessmentId) {
    return NextResponse.json({ error: "IDs required" }, { status: 400 });
  }

  // Fetch the unique grade record from the database.
  const grade = await prisma.grade.findUnique({
    where: { studentId_assessmentId: { studentId, assessmentId } },
  });
  return NextResponse.json(grade);
}

// POST method to submit or update a student's grade for an assessment.
// This method includes automatic classification and late submission detection.
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Validate the request body against the defined Zod schema.
    const validation = gradeSubmissionSchema.safeParse(body);

    // If validation fails, return a 400 Bad Request response with details.
    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation Failed",
          details: validation.error,
        },
        { status: 400 },
      );
    }

    const { studentId, assessmentId, score } = validation.data;

    // Determine the classification based on the score.
    // This provides a clear, rule-based academic classification.
    let classification: "DISTINCTION" | "MERIT" | "PASS" | "FAIL";
    if (score >= 70) {
      classification = "DISTINCTION";
    } else if (score >= 60) {
      classification = "MERIT";
    } else if (score >= 40) {
      classification = "PASS";
    } else {
      classification = "FAIL";
    }

    // Fetch the assessment details to check its deadline.
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: { deadline: true }, // Only retrieve the deadline to minimize data transfer.
    });

    // If the assessment is not found, return an error.
    if (!assessment) {
      return NextResponse.json(
        {
          error: "Assessment not found.",
          details: `Assessment with ID ${assessmentId} does not exist.`,
        },
        { status: 404 },
      );
    }

    // Determine if the submission is late by comparing the current time with the assessment deadline.
    // The `isLate` flag is crucial for academic reporting and potential penalties.
    const isLate = new Date() > assessment.deadline;

    // Upsert (update or insert) the grade record in the database.
    // This handles both new grade submissions and updates to existing grades.
    const updatedGrade = await prisma.grade.upsert({
      where: {
        studentId_assessmentId: {
          studentId: studentId,
          assessmentId: assessmentId,
        },
      },
      update: {
        score: score,
        classification: classification,
        isLate: isLate,
        isPublished: true, // Mark as published upon staff entry.
      },
      create: {
        studentId,
        assessmentId,
        score: score,
        classification: classification,
        isLate: isLate,
        isPublished: true, // Mark as published upon staff entry.
      },
    });

    // Return the updated or created grade record.
    return NextResponse.json(updatedGrade);
  } catch (error: any) {
    // Log any critical errors for debugging purposes.
    console.error("Critical Grading API Error [POST /api/grade]:", error);

    // Return a generic internal server error for unexpected issues.
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
