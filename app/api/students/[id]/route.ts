import { NextResponse } from "next/server";
import { enrolmentSchema } from "@/lib/validations/student";
import prisma from "@/lib/prisma";

/**
 * @desc GET: Fetch student details AND their published results
 * Logic: Combines core registry data with the assessment marksheet
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const studentWithResults = await prisma.student.findUnique({
      where: { id: params.id },
      include: {
        payments: true, // For fee balance calculation [cite: 20]
        grades: {
          where: { isPublished: true }, // Privacy: Only show released results [cite: 32, 33]
          include: {
            assessment: {
              select: {
                title: true,
                maxMarks: true,
                module: { select: { name: true, code: true } },
              },
            },
          },
        },
      },
    });

    if (!studentWithResults) {
      return NextResponse.json(
        { error: "Student record not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(studentWithResults);
  } catch (error: any) {
    console.error("GET_STUDENT_ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch record" },
      { status: 500 },
    );
  }
}

/**
 * @desc PATCH: Update student details (Registry Admin workflow) [cite: 12]
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const validatedData = enrolmentSchema.partial().parse(body);

    const updatedStudent = await prisma.student.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...(validatedData.dob && { dob: new Date(validatedData.dob) }),
      },
    });

    return NextResponse.json(updatedStudent);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * @desc DELETE: Remove student record (Registry Security) [cite: 12]
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await prisma.student.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Student deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to delete student record" },
      { status: 500 },
    );
  }
}
