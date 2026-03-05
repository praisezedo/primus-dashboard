import AcademicSession from "@/app/models/AcademicSession";
import Student from "@/app/models/Students";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";
import Setting from "@/app/models/Settings";
import FeesType from "@/app/models/FeesType";
import ClassFeeConfig from "@/app/models/ClassFeeConfig";
import StudentFee from "@/app/models/StudentFee";

// add a new student 
export async function POST(req: Request) {

     const ip = req.headers.get("x-forwarded-for") || "unknown";
    
     if (!rateLimit(ip , 5 , 60_000)) {
        return NextResponse.json({
            message: "Too many requests. Please try again later."
        }, {status: 429})
     }  
     
    try {
        await connectDB();

        const {schoolId} = await verifyAuth();

        const body = await req.json();

        const activeSession = await AcademicSession.findOne({schoolId , isActive: true});

        if (!activeSession) {
            return NextResponse.json (
                {message: "No active academic session"},
                {status: 400},
            );
        }

        const StudentState = {
            schoolId,
             sessionId: activeSession._id,
             studentName: body.studentName,
             studentId: body.studentId,
             className: body.className,
             section: body.section,
             parentName: body.parentName,
             parentPhone: body.parentPhone,
             parentEmail: body.parentEmail,
             smsStatus: body.notify ? "PENDING" : "",
        }
            const existingStudent = await Student.findOne({
            schoolId,
            sessionId: activeSession._id,
            studentId: body.studentId,
            });

            if (existingStudent) {
            return NextResponse.json(
            { message: "Student already exists" },
            { status: 400 }
            );
            }
        const student = await Student.create(StudentState);

         const feeTypes = await FeesType.find({ schoolId });

          for (const feeType of feeTypes) {
            const config = await ClassFeeConfig.findOne({
                schoolId ,
                sessionId: activeSession._id,
                 className: student.className,
                 feeTypeId: feeType._id,
                }); 

                if (!config) continue;
                 
                await StudentFee.create({
                    schoolId,
                    sessionId: activeSession._id,
                    studentId: student._id,
                    className: student.className,
                    feeTypeId: feeType._id,
                    totalAmount: config.amount,
                    amountPaid: 0,
                    balance: config.amount
                })
          }

        return NextResponse.json(student , {status: 201});
      
    } catch (error) {
        console.error("Create student error" , error);
        return NextResponse.json(
            {message: "Server Error"},
            {status: 500}
        )
    }
}

// for sorting student and returning students

export async function GET(req: Request) {

    try {
        await connectDB();

        const {schoolId} = await verifyAuth();

        const activeSession = await AcademicSession.findOne({schoolId , isActive: true});

        const sessionId = activeSession._id;

        const {searchParams} = new URL(req.url);

        const query: any = {schoolId , sessionId};

        if (searchParams.get("q")) {
            query.$or = [
                {studentName: {$regex: searchParams.get("q") , $options: "i"}},
                {studentId: { $regex: searchParams.get("q"), $options: "i" }},
            ];
        }

        if (searchParams.get("className")) {
            query.className = searchParams.get("className");
        }
        
        if (searchParams.get("section")) {
            query.section = searchParams.get("section");
        }
 
       if (searchParams.get("smsStatus")) {
      query.smsStatus = searchParams.get("smsStatus")?.toUpperCase();
    }

   const page = Number(searchParams.get("page")) || 1;
  const limit = 20;
  
    const skip = (page - 1) * limit;

    const students = await Student.find(query)
    .sort({ createdAt: -1 })
    .lean();

    const total = await Student.countDocuments(query);

        return NextResponse.json({ students, total, page, limit });
    } catch (error) {
       console.log("Fetch students error" , error);
      return NextResponse.json(
        {message: "Server error"},
        {status: 500}
      );
    }
}