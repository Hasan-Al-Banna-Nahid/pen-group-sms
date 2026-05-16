// utils/studentIdGenerator.ts

import { PrismaClient } from '@/prisma/lib/generated/prisma/client';

async function getNextStudentSequence(tx: PrismaClient): Promise<number> {
    const academicYear = 2026;
    let yearlySequence = await tx.yearlySequence.findUnique({
        where: { year: academicYear },
    });

    if (!yearlySequence) {
        yearlySequence = await tx.yearlySequence.create({
            data: { year: academicYear, sequenceNumber: 0 },
        });
    }

    const nextSequence = yearlySequence.sequenceNumber + 1;

    await tx.yearlySequence.update({
        where: { year: academicYear },
        data: { sequenceNumber: nextSequence },
    });

    return nextSequence;
}

export async function generateStudentId(tx: any): Promise<string> {
    const year = "2026";
    const sequence = await getNextStudentSequence(tx);
    const paddedSequence = sequence.toString().padStart(4, '0');

    return `SMS-${year}-${paddedSequence}`;
}

// Example usage in an API route (e.g., app/api/students/route.ts):
/*
import { NextResponse } from 'next/server';
import { generateStudentId } from '@/utils/studentIdGenerator'; // Adjust path as needed
import { prisma } from '@/lib/prisma'; // Your Prisma client instance

export async function POST(request: Request) {
  try {
    const { fullName, email, dob, programmeId, academicYear, ...otherData } = await request.json();

    const studentId = await generateStudentId();

    const newStudent = await prisma.student.create({
      data: {
        studentId,
        fullName,
        email,
        dob,
        programmeId,
        academicYear,
        // ... any other fields you want to set
      },
    });

    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error('Error creating student:', error);
    return NextResponse.json({ message: 'Failed to create student' }, { status: 500 });
  }
}
*/
