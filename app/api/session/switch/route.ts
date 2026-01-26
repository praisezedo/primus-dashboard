import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
export async function POST(req: Request) {
  await connectDB();

  const { schoolId } = await verifyAuth();
  const { sessionId } = await req.json();

await AcademicSession.updateMany(
  { schoolId, _id: { $ne: sessionId } },
  { isActive: false }
);

const updated = await AcademicSession.updateOne(
  { schoolId, _id: sessionId },
  { isActive: true }
);


  if (updated.matchedCount === 0) {
    return NextResponse.json(
      { message: "Session not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Academic Session Switched",
  });
}



