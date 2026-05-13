import { NextResponse } from "next/server";
import { enrolmentSchema } from "@/lib/validations/student";
import prisma from "@/lib/prisma";
import { generateStudentId } from "@/utils/studentIdGenerator";

/**
 * @desc Get all students for the Registry Dashboard [cite: 16, 21]
 */
export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { createdAt: "desc" },
      include: { payments: true }, // Include payments to calculate balance in real-time [cite: 20]
    });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch students" },
      { status: 500 },
    );
  }
}

/**
 * @desc Enrol a new student [cite: 11]
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = enrolmentSchema.parse(body);

    const result = await prisma.$transaction(
      async (tx) => {
        // Auto-generate student ID
        const studentId = await generateStudentId(tx);

        // Fetch programme to get baseFee
        let baseFee = 0;
        if (validatedData.programmeId) {
          const programme = await tx.programme.findUnique({
            where: { id: validatedData.programmeId },
            select: { baseFee: true },
          });
          if (programme) {
            baseFee = programme.baseFee;
          }
        }

        return await tx.student.create({
          data: {
            ...validatedData,
            studentId: studentId,
            dob: new Date(validatedData.dob),
            totalFees: baseFee, // Set totalFees from programme's baseFee
            feeAmount: baseFee // Also set feeAmount from programme's baseFee
          },
        });
      },
      {
        maxWait: 10000,
        timeout: 20000,
      },
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("STUDENT_ENROLLMENT_ERROR:", error); // Log the actual error
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
