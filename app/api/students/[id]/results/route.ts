import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { getFinancialStatus } from "@/lib/financial-logic";

// Zod schema for validating the student ID from the URL parameters.
const studentIdSchema = z.object({
  id: z.string().min(1, "Student ID is required."),
});

/**
 * GET handler for the student's results API.
 * This endpoint allows students to view their grades, with a financial guard.
 * If a student has an outstanding balance, their actual scores and classifications are withheld.
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    // Validate the student ID from the URL parameters.
    const validation = studentIdSchema.safeParse(params);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation Failed",
          details: validation.error.errors,
        },
        { status: 400 },
      );
    }

    const { id: studentId } = validation.data;

    // Fetch student information, including their total fees and payments.
    // This is necessary to determine their financial standing.
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
        programme: {
          select: {
            baseFee: true,
          },
        },
      },
    });

    if (!student) {
      return NextResponse.json(
        { error: "Student not found.", details: `Student with ID ${studentId} does not exist.` },
        { status: 404 },
      );
    }

    // Calculate total fees and total paid to determine the financial status.
    // The `totalFees` field from the student record is used as the basis.
    const totalFees = student.totalFees;
    const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);

    // Use the financial logic helper to get the student's financial status.
    const financialStatus = getFinancialStatus(totalFees, totalPaid);

    // Implement the "Financial Guard" feature.
    // If the student has an outstanding balance, hide their actual grades.
    if (financialStatus.status === "OUTSTANDING") {
      // Fetch all grades for the student, but mask sensitive information.
      const withheldGrades = await prisma.grade.findMany({
        where: { studentId: studentId, isPublished: true },
        select: {
          id: true,
          assessmentId: true,
          isPublished: true,
          isLate: true,
          // For security and privacy, actual score and classification are not selected.
          // They are replaced with a "WITHHELD" status.
        },
      });

      // Map the grades to include the "WITHHELD" status.
      const formattedWithheldGrades = withheldGrades.map((grade) => ({
        ...grade,
        score: "WITHHELD",
        classification: "WITHHELD",
      }));

      return NextResponse.json({
        studentId: student.studentId,
        fullName: student.fullName,
        financialStatus: financialStatus.status,
        grades: formattedWithheldGrades,
        message: "Grades are withheld due to an outstanding balance.",
      });
    }

    // If there is no outstanding balance, fetch and return the actual grades.
    const grades = await prisma.grade.findMany({
      where: { studentId: studentId, isPublished: true },
      include: {
        assessment: {
          select: {
            title: true,
            weightage: true,
            deadline: true,
          },
        },
      },
    });

    // Format the grades to include relevant assessment details.
    const formattedGrades = grades.map((grade) => ({
      id: grade.id,
      assessment: {
        id: grade.assessmentId,
        title: grade.assessment.title,
        weightage: grade.assessment.weightage,
        deadline: grade.assessment.deadline,
      },
      score: grade.score,
      classification: grade.classification,
      isLate: grade.isLate,
      isPublished: grade.isPublished,
      createdAt: grade.createdAt,
    }));

    // Return the student's grades and financial status.
    return NextResponse.json({
      studentId: student.studentId,
      fullName: student.fullName,
      financialStatus: financialStatus.status,
      grades: formattedGrades,
    });
  } catch (error: any) {
    console.error("Critical Student Results API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
