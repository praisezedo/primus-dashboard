import {  NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Student from "@/app/models/Students";
import { DashboardOverview } from "@/types/dashboard";
import Admin from "@/app/models/Admin";
import { getAdminFromToken } from "@/lib/getadminfromtoken";

export async function GET() {

try {
    await connectDB();
    
      const {schoolId , sessionId} = (await getAdminFromToken());
      
 const totalStudents = await Student.countDocuments({schoolId , sessionId});

 const paid = await Student.countDocuments({
    schoolId,
    sessionId,
    feesStatus: "PAID"
 });

 const unpaid = await Student.countDocuments({
    schoolId,
    sessionId,
    feesStatus: "UNPAID",
 });

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

