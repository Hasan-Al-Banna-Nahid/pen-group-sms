import { NextResponse } from "next/server";
import { enrolmentSchema } from "@/lib/validations/student";
import prisma from "@/lib/prisma";
import { generateStudentId } from "@/utils/studentIdGenerator";
import { getFinancialStatus } from "@/lib/financial-logic";

/**
 * @desc Get all students for the Registry Dashboard
 */
export async function GET() {
  try {
    // any কাস্টিং টাইপস্ক্রিপ্টের never কনফ্লিক্ট দূর করবে যতক্ষণ না ক্যাশ রি-বিল্ড হচ্ছে
    const client = prisma as any;

    const students = await client.student.findMany({
      include: {
        payments: true,
        programme: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedStudents = students.map((student: any) => {
      const totalPaid = student.payments.reduce(
        (sum: any, p: any) => sum + p.amount,
        0,
      );
      const financialInfo = getFinancialStatus(
        student.totalFees,
        totalPaid,
        student.feeDueDate,
      );

      return {
        ...student,
        balance: financialInfo.balance,
        isOverdue: financialInfo.isOverdue,
        isCriticalOverdue: financialInfo.isCritical,
        financialStatus: financialInfo.status,
        programme: student.programme?.name || "Unassigned",
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error("GET_STUDENTS_CRITICAL_ERROR:", error);

    if (error.code === "P1001" || error.code === "P1017") {
      return NextResponse.json(
        {
          error: "Service Unavailable",
          message: "Database connection failed. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "Database Error",
        message: error.message || "Failed to fetch students from Neon.",
      },
      { status: 500 },
    );
  }
}

/**
 * @desc Enrol a new student
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = enrolmentSchema.parse(body);

    const result = await prisma.$transaction(
      async (tx: any) => {
        // tx কে explicitly any দেওয়া হয়েছে টাইপ ব্রেকিং এড়াতে
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
            totalFees: baseFee,
            feeAmount: baseFee,
            feeDueDate: validatedData.feeDueDate
              ? new Date(validatedData.feeDueDate)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
    console.error("STUDENT_ENROLLMENT_ERROR:", error);

    if (error.code === "P1001" || error.code === "P1017") {
      return NextResponse.json(
        {
          error: "Service Unavailable",
          message: "Database connection failed. Please try again in a moment.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
