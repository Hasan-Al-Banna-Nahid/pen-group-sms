import "dotenv/config";

import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

import { generateStudentId } from "../utils/studentIdGenerator";
import { EnrolmentStatus, PrismaClient } from "./lib/generated/prisma/client";

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

  // Cleanup
  await prisma.grade.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.student.deleteMany();
  await prisma.programme.deleteMany();
  await prisma.yearlySequence.deleteMany();

  console.log("🧹 Database cleaned");

  // Programmes
  const bscCs = await prisma.programme.create({
    data: {
      name: "BSc Computer Science",
      baseFee: 9000,
    },
  });

  const mscDs = await prisma.programme.create({
    data: {
      name: "MSc Data Science",
      baseFee: 12000,
    },
  });

  console.log("✅ Programmes created");

  // Modules
  const comp101 = await prisma.module.create({
    data: {
      code: "COMP101",
      name: "Introduction to Programming",
      credits: 20,
    },
  });

  const data501 = await prisma.module.create({
    data: {
      code: "DATA501",
      name: "Advanced Data Analytics",
      credits: 20,
    },
  });

  console.log("✅ Modules created");

  // Assessments
  const assessment1 = await prisma.assessment.create({
    data: {
      title: "Programming Fundamentals Assignment",
      maxMarks: 100,
      weightage: 50,
      deadline: new Date("2026-05-20T23:59:59Z"),
      moduleId: comp101.id,
    },
  });

  const assessment2 = await prisma.assessment.create({
    data: {
      title: "Big Data Case Study",
      maxMarks: 100,
      weightage: 50,
      deadline: new Date("2026-06-15T23:59:59Z"),
      moduleId: data501.id,
    },
  });

  console.log("✅ Assessments created");

  // STUDENT A
  await prisma.$transaction(async (tx: any) => {
    const generatedId = await generateStudentId(tx);

    const student = await tx.student.create({
      data: {
        studentId: generatedId,
        fullName: "Hasan Al Banna Nahid",
        email: "nahid@example.com",
        dob: new Date("2001-01-01"),

        programmeId: bscCs.id,

        academicYear: "2026/2027",

        status: EnrolmentStatus.ENROLLED,

        feeAmount: bscCs.baseFee,
        totalFees: bscCs.baseFee,
      },
    });

    // Payment
    await tx.payment.create({
      data: {
        studentId: student.id,
        amount: 5000,
        reference: "PAY-001",
      },
    });

    // Submission
    await tx.submission.create({
      data: {
        studentId: student.id,
        assessmentId: assessment1.id,
        fileUrl: "/uploads/nahid-assignment.pdf",
        isLate: false,
      },
    });

    // Grade
    await tx.grade.create({
      data: {
        studentId: student.id,
        assessmentId: assessment1.id,

        score: 85,

        classification: "DISTINCTION",

        isPublished: true,

        feedback: "Excellent work",
      },
    });

    console.log(`✅ Student created: ${student.fullName}`);
  });

  // STUDENT B
  await prisma.$transaction(async (tx: any) => {
    const generatedId = await generateStudentId(tx);

    const student = await tx.student.create({
      data: {
        studentId: generatedId,

        fullName: "Alice Johnson",

        email: "alice@example.com",

        dob: new Date("2000-09-12"),

        programmeId: mscDs.id,

        academicYear: "2026/2027",

        status: EnrolmentStatus.ENROLLED,

        feeAmount: mscDs.baseFee,

        totalFees: mscDs.baseFee,
      },
    });

    await tx.payment.create({
      data: {
        studentId: student.id,
        amount: 3000,
        reference: "PAY-002",
      },
    });

    await tx.submission.create({
      data: {
        studentId: student.id,
        assessmentId: assessment2.id,
        fileUrl: "/uploads/alice-case-study.pdf",
        isLate: true,
      },
    });

    await tx.grade.create({
      data: {
        studentId: student.id,
        assessmentId: assessment2.id,

        score: 62,

        classification: "MERIT",

        isPublished: false,

        feedback: "Good work but late submission",
      },
    });

    console.log(`✅ Student created: ${student.fullName}`);
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
