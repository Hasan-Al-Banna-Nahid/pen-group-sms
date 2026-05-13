import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * @desc Record a payment transaction and sync with database
 * Features: Proper error logging and server-side validation
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { studentId, amount, reference } = body;

    // 1. Critical Validation: Ensure fields exist before DB operation
    if (!studentId || amount === undefined) {
      return NextResponse.json(
        { error: "Student ID and Amount are required" },
        { status: 400 },
      );
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return NextResponse.json(
        { error: "Invalid payment amount provided" },
        { status: 400 },
      );
    }

    // 2. Database Operation
    const payment = await prisma.payment.create({
      data: {
        studentId,
        amount: numericAmount,
        reference: reference || "REG-PAYMENT",
        // Note: Prisma usually handles createdAt automatically.
        // Only use 'date' if you have defined it manually in schema.prisma.
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error: any) {
    // 3. Debugging: Log the actual error in terminal to see what's wrong
    console.error("PRISMA_PAYMENT_ERROR:", error);

    // Provide a more descriptive error if possible
    return NextResponse.json(
      {
        error: "Payment recording failed",
        details: error.message,
      },
      { status: 500 }, // Changed to 500 as it's likely a DB/Server issue
    );
  }
}
