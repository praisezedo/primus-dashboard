import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  
  if (!rateLimit(ip , 5 , 60_000)) {
     return NextResponse.json({
         message: "Too many requests. Please try again later."
     }, {status: 429})
  }

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



