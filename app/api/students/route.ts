import { NextResponse } from "next/server";
import { enrolmentSchema } from "@/lib/validations/student";
import prisma from "@/lib/prisma";

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
        const year = new Date().getFullYear();
        const count = await tx.student.count();
        const formattedId = `SMS-${year}-${(count + 1).toString().padStart(4, "0")}`; // Auto-generate ID [cite: 14]

        return await tx.student.create({
          data: {
            ...validatedData,
            studentId: formattedId,
            dob: new Date(validatedData.dob),
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
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
