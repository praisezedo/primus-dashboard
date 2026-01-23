import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import { connect } from "http2";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
   
    await connectDB();

    const {schoolId} = await verifyAuth();

    const {sessionId} = await req.json();

    await AcademicSession.updateMany({
        schoolId
    } , {isActive: false});

    await AcademicSession.updateOne({schoolId , sessionId} , {isActive: true});

    return NextResponse.json({message: "Academic Session Switched" });
}



