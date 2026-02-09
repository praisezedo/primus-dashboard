import Student from "@/app/models/Students";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import AcademicSession from "@/app/models/AcademicSession";
import {rateLimit} from "@/lib/ratelimit";

// for geting a particular student
export async function GET(req: Request , {params}: {params: Promise<{id: string}>}) {
    
   const ip = req.headers.get("x-forwarded-for") || "unknown";
  
   if (!rateLimit(ip , 5 , 60_000)) {
      return NextResponse.json({
          message: "Too many requests. Please try again later."
      }, {status: 429})
   }
    await connectDB();

     const { id } = await params;

    const {schoolId} = await verifyAuth();

    const student = await Student.findOne({_id: id, schoolId});

    if (!student) {
        return NextResponse.json({message: "Not Found"} , {status: 404});
    }
    return NextResponse.json(student);
}

// for updating student 
export async function PUT(req: Request , {params}: {params: Promise<{id: string}>}) {

     const { id } = await params;

    await connectDB();
    const {schoolId} = await verifyAuth();

    const body = await req.json();
    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});
    
    const student = await Student.findOneAndUpdate({_id: id , schoolId , sessionId: activeSession?._id } , body , {new: true , runValidators: true });

    if (!student) {
    return NextResponse.json({ message: "Student not found" }, { status: 404 });
  }

    return NextResponse.json(student);
}

// for deleting student 
export async function DELETE(_:Request , {params}: {params: Promise<{id: string}>}) {

     const { id } = await params;

    await connectDB();

    const {schoolId} = await verifyAuth();
    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});
    await Student.deleteOne({_id: id , schoolId , sessionId: activeSession?._id });

    return NextResponse.json({message: "Student deleted"});
}