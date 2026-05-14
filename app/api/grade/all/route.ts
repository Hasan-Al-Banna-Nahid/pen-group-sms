import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        student: {
          select: {
            fullName: true,
            studentId: true,
          }
        },
        assessment: {
          select: {
            title: true,
            module: {
              select: {
                code: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(grades);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch all grades" }, { status: 500 });
  }
}
