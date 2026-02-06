import AcademicSession from "@/app/models/AcademicSession";
import Student from "@/app/models/Students";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDB();
    const {schoolId} = await verifyAuth();
    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});
    const totalStudent = await Student.countDocuments({schoolId , sessionId:activeSession._id});

    return NextResponse.json({totalStudent});
}