import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Submission } from "@/models/Submission";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mistake, details, fixes, createdAt } = body;

    await connectToDatabase();

    const submission = new Submission({
      mistake,
      details,
      fixes,
      createdAt: createdAt || new Date(),
    });

    await submission.save();

    return NextResponse.json({ success: true, message: "Submission saved" }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Submission error:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Database save failed" },
      { status: 500 }
    );
  }
}
