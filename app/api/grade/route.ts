import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const assessmentId = searchParams.get("assessmentId");

  if (!studentId || !assessmentId) {
    return NextResponse.json({ error: "IDs required" }, { status: 400 });
  }

  const grade = await prisma.grade.findUnique({
    where: { studentId_assessmentId: { studentId, assessmentId } },
  });
  return NextResponse.json(grade);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, assessmentId, score } = body;

    // 1. Validation: Ensure all required fields are present
    if (!studentId || !assessmentId || score === undefined) {
      return NextResponse.json(
        {
          error: "Validation Failed",
          details: "studentId, assessmentId, and score are required.",
        },
        { status: 400 },
      );
    }

    // 2. Type Conversion: Ensure score is a valid number for PostgreSQL Float type
    const numericScore = parseFloat(score);
    if (isNaN(numericScore)) {
      return NextResponse.json(
        {
          error: "Invalid Data",
          details: "Score must be a valid numeric value.",
        },
        { status: 400 },
      );
    }

    // 3. Database Operation: Upsert grade based on unique compound index
    // Note: 'classification' is omitted as it is not present in your provided Prisma model
    const updatedGrade = await prisma.grade.upsert({
      where: {
        studentId_assessmentId: {
          studentId: studentId,
          assessmentId: assessmentId,
        },
      },
      update: {
        score: numericScore,
        // Optional: updated at timestamp or feedback could be handled here
      },
      create: {
        studentId,
        assessmentId,
        score: numericScore,
        isPublished: true, // Results are marked as published upon staff entry
      },
    });

    return NextResponse.json(updatedGrade);
  } catch (error: any) {
    // Log the exact error to the server console for debugging
    console.error("Critical Registry Error [POST /api/grade]:", error);

    // Return detailed error information to identify Prisma/Database level issues
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message,
        prismaCode: error.code, // Useful for identifying P2002 (Unique constraint) etc.
      },
      { status: 500 },
    );
  }
}
