
import Admin from "@/app/models/Admin";
import { NextResponse } from "next/server";
import { validateSession } from "@/lib/validatesession";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";

export async function GET() {

    await connectDB()
    
  const { schoolId } = await verifyAuth();


     if (!schoolId) {

         return NextResponse.json({
            message: "UnAuthorized"
         } , {status: 401})
     }



     const admin = await Admin.findOne({schoolId})
      const schoolName = admin.schoolName;
      const adminName = admin.adminName;

     return NextResponse.json({
         message: "data fetch successful !!",
         body: {schoolName , adminName}
     } , {status: 200})

}