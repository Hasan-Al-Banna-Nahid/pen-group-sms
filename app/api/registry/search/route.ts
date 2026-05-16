import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getFinancialStatus } from "@/lib/financial-logic";
import { z } from "zod";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Define Zod schema for query parameters with defaults
    const querySchema = z.object({
      query: z.string().default(""),
      enrolmentStatus: z
        .enum(["ENROLLED", "WITHDRAWN", "COMPLETED"])
        .optional(),
      financialStatus: z
        .enum(["SETTLED", "OUTSTANDING", "CRITICAL_OVERDUE"])
        .optional(),
    });

    const parsedParams = querySchema.safeParse(
      Object.fromEntries(searchParams),
    );

    if (!parsedParams.success) {
      return NextResponse.json(
        {
          error: "Invalid query parameters",
          details: parsedParams.error.flatten(),
        },
        { status: 400 },
      );
    }

    const { query, enrolmentStatus, financialStatus } = parsedParams.data;

    // Build dynamic where clause
    const where: any = {
      AND: [],
    };

    if (enrolmentStatus) {
      where.AND.push({ status: enrolmentStatus });
    }

    if (query) {
      where.AND.push({
        OR: [
          { fullName: { contains: query, mode: "insensitive" } },
          { studentId: { contains: query, mode: "insensitive" } },
          {
            programme: {
              name: { contains: query, mode: "insensitive" },
            },
          },
        ],
      });
    }

    const students = await prisma.student.findMany({
      where: where.AND.length > 0 ? where : {},
      include: {
        payments: {
          select: {
            amount: true,
          },
        },
        grades: {
          where: { isPublished: false },
          select: { id: true },
        },
        programme: {
          select: {
            name: true,
            baseFee: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Post-query filtering for financial status
    let filteredStudents = students;
    if (financialStatus) {
      filteredStudents = students.filter((student: any) => {
        const totalPaid = student.payments.reduce(
          (sum: any, p: any) => sum + p.amount,
          0,
        );
        const finStatus = getFinancialStatus(
          student.totalFees,
          totalPaid,
          student.feeDueDate,
        );

        if (financialStatus === "SETTLED")
          return finStatus.status === "SETTLED";
        if (financialStatus === "OUTSTANDING")
          return finStatus.status === "OUTSTANDING" && !finStatus.isCritical;
        if (financialStatus === "CRITICAL_OVERDUE") return finStatus.isCritical;
        return true;
      });
    }

    const formattedStudents = filteredStudents.map((student: any) => {
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
        financialStatus: financialInfo.status,
        isCriticalOverdue: financialInfo.isCritical,
        isOverdue: financialInfo.isOverdue,
        programmeName: student.programme?.name,
        balance: financialInfo.balance,
        withheldCount: student.grades.length,
      };
    });

    return NextResponse.json(formattedStudents);
  } catch (error: any) {
    console.error("SEARCH_API_CRITICAL_FAILURE:", error);

    // Handle database connection issues (Prisma v7)
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
        error: "Internal Server Error",
        message: error.message || "Failed to process search request.",
      },
      { status: 500 },
    );
  }
}
