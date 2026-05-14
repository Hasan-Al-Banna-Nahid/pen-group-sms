import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateStudentId } from "../utils/studentIdGenerator";
import { EnrolmentStatus, Classification, PrismaClient } from "./lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🚀 Starting seed...");

  // Cleanup in correct order to avoid foreign key violations
  await prisma.grade.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.student.deleteMany();
  await prisma.programme.deleteMany();
  await prisma.yearlySequence.deleteMany();

  console.log("🧹 Database cleaned");

  // 1. Two Programmes (CS and Business) with different fees
  const csProgramme = await prisma.programme.create({
    data: {
      name: "Computer Science",
      baseFee: 10000,
    },
  });

  const businessProgramme = await prisma.programme.create({
    data: {
      name: "Business Management",
      baseFee: 8000,
    },
  });

  console.log("✅ Programmes created: CS and Business");

  // Modules
  const csModule = await prisma.module.create({
    data: {
      code: "CS101",
      name: "Algorithms & Data Structures",
      credits: 20,
    },
  });

  const bizModule = await prisma.module.create({
    data: {
      code: "BUS101",
      name: "Principles of Management",
      credits: 15,
    },
  });

  console.log("✅ Modules created");

  // 4. One Assessment with a past deadline
  const pastDeadline = new Date();
  pastDeadline.setDate(pastDeadline.getDate() - 7); // 7 days ago

  const csAssessment = await prisma.assessment.create({
    data: {
      title: "Mid-term Project",
      maxMarks: 100,
      weightage: 40,
      deadline: pastDeadline,
      moduleId: csModule.id,
    },
  });

  const bizAssessment = await prisma.assessment.create({
    data: {
      title: "Business Case Analysis",
      maxMarks: 100,
      weightage: 30,
      deadline: new Date("2026-12-01"),
      moduleId: bizModule.id,
    },
  });

  console.log("✅ Assessments created (one with past deadline)");

  // 2. Five Students with auto-generated IDs
  const studentData = [
    { fullName: "John Doe", email: "john@example.com", programmeId: csProgramme.id, feeAmount: 10000 },
    { fullName: "Jane Smith", email: "jane@example.com", programmeId: csProgramme.id, feeAmount: 10000 },
    { fullName: "Alice Brown", email: "alice@example.com", programmeId: businessProgramme.id, feeAmount: 8000 },
    { fullName: "Bob Wilson", email: "bob@example.com", programmeId: businessProgramme.id, feeAmount: 8000 },
    { fullName: "Charlie Davis", email: "charlie@example.com", programmeId: csProgramme.id, feeAmount: 10000 },
  ];

  const students = [];

  for (const data of studentData) {
    const student = await prisma.$transaction(async (tx) => {
      const studentId = await generateStudentId(tx);
      return await tx.student.create({
        data: {
          studentId,
          fullName: data.fullName,
          email: data.email,
          dob: new Date("2000-01-01"),
          programmeId: data.programmeId,
          academicYear: "2026",
          status: EnrolmentStatus.ENROLLED,
          feeAmount: data.feeAmount,
          totalFees: data.feeAmount,
          feeDueDate: new Date("2026-12-31"),
        },
      });
    });
    students.push(student);
    console.log(`✅ Student created: ${student.fullName} (${student.studentId})`);
  }

  // 3. Ensure one student has a 'Critical Overdue' balance
  // John Doe (students[0]) will be critical due to past due date and no payments.
  const pastDueDate = new Date();
  pastDueDate.setDate(pastDueDate.getDate() - 30); // 30 days ago

  await prisma.student.update({
    where: { id: students[0].id },
    data: {
      feeDueDate: pastDueDate,
    },
  });
  console.log(`⚠️ Student ${students[0].fullName} set to Critical Overdue (Past Due Date)`);

  // 4. Create a 'Late Submission' from a student for the past assessment
  // Jane Smith (students[1]) will submit late.
  const lateSubmissionDate = new Date();
  lateSubmissionDate.setDate(pastDeadline.getDate() + 1); // 1 day after deadline

  await prisma.submission.create({
    data: {
      studentId: students[1].id,
      assessmentId: csAssessment.id,
      fileUrl: "/uploads/late-assignment.pdf",
      submittedAt: lateSubmissionDate,
      isLate: true,
    },
  });
  console.log(`🚩 Late submission created for ${students[1].fullName}`);

  // Normal submission for Charlie
  await prisma.submission.create({
    data: {
      studentId: students[4].id,
      assessmentId: csAssessment.id,
      fileUrl: "/uploads/ontime-assignment.pdf",
      submittedAt: pastDeadline,
      isLate: false,
    },
  });

  // Add a grade for Jane Smith to test visual flags in assessment card
  await prisma.grade.create({
    data: {
      studentId: students[1].id,
      assessmentId: csAssessment.id,
      score: 45,
      classification: Classification.PASS,
      isPublished: true,
      feedback: "Submitted late, but passed.",
    },
  });

  console.log("🎉 Seed completed successfully");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
