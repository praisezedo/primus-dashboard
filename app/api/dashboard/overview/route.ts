import {  NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/app/models/Students";
import { DashboardOverview } from "@/types/dashboard";
import Admin from "@/app/models/Admin";
import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";


export async function GET() {

try {
    await connectDB();
    
    const { schoolId } = await verifyAuth();
     
    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});

 const paid = await Student.countDocuments({
    schoolId,
    sessionId: activeSession._id,
    feesStatus: "PAID"
 });

 const unpaid = await Student.countDocuments({
    schoolId,
    sessionId: activeSession._id,
    feesStatus: "UNPAID",
 });

 const totalStudents = await Student.countDocuments({schoolId , sessionId: activeSession._id})

 const admin = await Admin.findOne({schoolId})

 return NextResponse.json({
    totalStudents,
    paid,
    unpaid,
     adminName: admin.adminName,
       
 } as DashboardOverview);

} catch  {
    return NextResponse.json(
        {message: "Unauthorized"},
        {status: 401}
    );
}
}

