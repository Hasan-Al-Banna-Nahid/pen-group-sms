import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getFinancialStatus } from "@/lib/financial-logic";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Define Zod schema for query parameters
    const querySchema = z.object({
      query: z.string().optional(),
      enrolmentStatus: z.enum(["ENROLLED", "WITHDRAWN", "COMPLETED"]).optional(),
      financialStatus: z.enum(["SETTLED", "OUTSTANDING", "CRITICAL_OVERDUE"]).optional(),
    });

    const validatedQueryParams = querySchema.safeParse(Object.fromEntries(searchParams));

    if (!validatedQueryParams.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: validatedQueryParams.error.errors,
        },
        { status: 400 }
      );
    }

    const { query, enrolmentStatus, financialStatus } = validatedQueryParams.data;

    let students = await prisma.student.findMany({
      where: {
        AND: [
          enrolmentStatus ? { status: enrolmentStatus } : {},
          query
            ? {
                OR: [
                  { fullName: { contains: query, mode: "insensitive" } },
                  { studentId: { contains: query, mode: "insensitive" } },
                  { programme: { name: { contains: query, mode: "insensitive" } } },
                ],
              }
            : {},
        ],
      },
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
        programme: {
          select: {
            name: true,
            baseFee: true,
          },
        },
      },
    });

    // Filter by financial status after calculating it
    if (financialStatus) {
      students = students.filter((student) => {
        const totalFees = student.totalFees; 
        const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
        const studentFinancialStatus = getFinancialStatus(totalFees, totalPaid, student.feeDueDate);

        if (financialStatus === "SETTLED") {
          return studentFinancialStatus.status === "SETTLED";
        } else if (financialStatus === "OUTSTANDING") {
          return studentFinancialStatus.status === "OUTSTANDING" && !studentFinancialStatus.isCritical;
        } else if (financialStatus === "CRITICAL_OVERDUE") {
          return studentFinancialStatus.isCritical;
        }
        return false;
      });
    }

    // Format the students to include financial status
    const formattedStudents = students.map((student) => {
      const totalFees = student.totalFees;
      const totalPaid = student.payments.reduce((sum, payment) => sum + payment.amount, 0);
      const financialInfo = getFinancialStatus(totalFees, totalPaid, student.feeDueDate);
      return {
        ...student,
        financialStatus: financialInfo.status,
        isCriticalOverdue: financialInfo.isCritical,
        isOverdue: financialInfo.isOverdue, // Added for UI if needed
        programmeName: student.programme?.name,
        balance: financialInfo.balance,
      };
    });


    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error("Critical Registry Search API Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error.message || "An unexpected error occurred.",
      },
      { status: 500 },
    );
  }
}
