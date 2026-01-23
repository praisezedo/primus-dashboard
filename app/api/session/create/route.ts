import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { schoolId } = await verifyAuth();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { message: "Session name is required" },
        { status: 400 }
      );
    }

    // deactivate old session
    await AcademicSession.updateMany(
      { schoolId, isActive: true },
      { isActive: false }
    );

    const session = await AcademicSession.create({
      schoolId,
      name,
      isActive: true,
    });

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    console.error("Create session error", error);
    return NextResponse.json(
      { message: "Unauthorized or server error" },
      { status: 401 }
    );
  }
}
