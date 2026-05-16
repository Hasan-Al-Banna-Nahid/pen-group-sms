import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const assessments = await prisma.assessment.findMany({
      include: {
        module: true,
        submissions: {
          include: {
            student: true,
          },
        },
        grades: true,
      },
      orderBy: { deadline: "asc" },
    });

    return NextResponse.json(assessments);
  } catch (error: any) {
    console.error("ASSESSMENT_FETCH_CRITICAL_ERROR:", error);
    
    // Handle database connection issues (Prisma v7)
    if (error.code === "P1001" || error.code === "P1017") {
      return NextResponse.json(
        { 
          error: "Service Unavailable", 
          message: "Database connection failed. Please try again in a moment." 
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json(
      { 
        error: "Internal Server Error",
        message: error.message || "An error occurred while fetching assessments." 
      },
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
    console.error("ASSESSMENT_CREATE_ERROR:", error);

    // Handle database connection issues (Prisma v7)
    if (error.code === "P1001" || error.code === "P1017") {
      return NextResponse.json(
        { 
          error: "Service Unavailable", 
          message: "Database connection failed. Please try again in a moment." 
        }, 
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
