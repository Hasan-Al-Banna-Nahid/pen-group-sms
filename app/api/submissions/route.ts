import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const studentId = formData.get("studentId") as string;
    const assessmentId = formData.get("assessmentId") as string;

    // 1. Basic Validation
    if (!file || !studentId || !assessmentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Setup Upload Directory (Safe Path)
    const uploadDir = join(process.cwd(), "public", "uploads");

    // 3. Create directory if not exists
    try {
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
        console.log("Uploads directory created at:", uploadDir);
      }
    } catch (err) {
      console.error("Directory creation failed:", err);
      return NextResponse.json(
        { error: "Storage directory initialization failed" },
        { status: 500 },
      );
    }

    // 4. Sanitize Filename (Remove spaces and special characters)
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const filePath = join(uploadDir, safeFileName);

    // 5. Write File to Disk
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
    } catch (err) {
      console.error("File system write error:", err);
      return NextResponse.json(
        { error: "Could not write file to server disk" },
        { status: 500 },
      );
    }

    const fileUrl = `/uploads/${safeFileName}`;

    // 6. Database Operation (Using upsert for Registry efficiency)
    const submission = await prisma.submission.upsert({
      where: {
        studentId_assessmentId: { studentId, assessmentId },
      },
      update: {
        fileUrl,
        submittedAt: new Date(),
      },
      create: {
        fileUrl,
        studentId,
        assessmentId,
        submittedAt: new Date(),
      },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error: any) {
    console.error("CRITICAL_API_ERROR:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error.message,
      },
      { status: 500 },
    );
  }
}
