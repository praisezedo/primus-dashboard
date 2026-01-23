import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export  async function GET() {
    
    await connectDB()

    const {schoolId} = await verifyAuth();

    const sessions = await AcademicSession.find({schoolId}).sort({createdAt: -1});

    return NextResponse.json(sessions);
}




