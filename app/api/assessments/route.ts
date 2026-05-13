import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        module: true, // Shows module details
        submissions: {
          include: {
            student: true, // Shows which student submitted what
          },
        },
        grades: true, // CRITICAL FIX: Include grades table to show marks
      },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json(assessments);
  } catch (error: any) {
    console.error("FETCH_ERROR:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch assessments" },
      { status: 500 },
    );
  }
}

// POST Method (Remains same as yours)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, maxMarks, weightage, deadline, moduleId } = body;
    const assessment = await prisma.assessment.create({
      data: {
        title,
        maxMarks,
        weightage,
        deadline: new Date(deadline),
        moduleId,
      },
    });
    return NextResponse.json(assessment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
