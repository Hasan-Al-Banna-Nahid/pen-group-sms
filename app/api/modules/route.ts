import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, name, credits } = await req.json();
    const module = await prisma.module.create({
      data: { code, name, credits: Number(credits) },
    });
    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Module already exists or data invalid" },
      { status: 500 },
    );
  }
}
