import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb"; // from Step 2
import { Submission } from "@/models/Submission";  // from Step 3

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
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Database save failed" },
      { status: 500 }
    );
  }
}
