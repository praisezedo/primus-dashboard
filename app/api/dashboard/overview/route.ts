import {  NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Student from "@/app/models/Students";
import { DashboardOverview } from "@/types/dashboard";
import Admin from "@/app/models/Admin";

export async function GET() {

try {
     const { schoolId } = await verifyAuth();

     await connectDB();

 const totalStudents = await Student.countDocuments({schoolId});
 const paid = await Student.countDocuments({
    schoolId,
    feesStatus: "PAID"
 });

 const unpaid = await Student.countDocuments({
    schoolId,
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

