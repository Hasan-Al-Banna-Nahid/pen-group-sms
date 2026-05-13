import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { enrolmentSchema } from "@/lib/validations/student";

/**
 * @desc Update student details (Registry Admin workflow)
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await req.json();
    const validatedData = enrolmentSchema.partial().parse(body); // Allow partial updates

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
 * @desc Delete student record (Handle with caution)
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
      { error: "Failed to delete student" },
      { status: 500 },
    );
  }
}
