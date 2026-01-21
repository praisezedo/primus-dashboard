import { verifyAuth } from "@/lib/auth";
import Admin from "@/app/models/Admin";
import { NextResponse } from "next/server";
import Setting from "@/app/models/Settings";

export async function GET() {

     const {schoolId} = await verifyAuth();

     if (!schoolId) {
         return NextResponse.json({
            message: "UnAuthorized"
         } , {status: 401})
     }

     const admin = await Admin.findOne({schoolId})

     const settings = await Setting.findOne({schoolId})

      const schoolName = admin.schoolName;
      const profilePic = settings.profilePic;

     return NextResponse.json({
         message: "data fetch successful !!",
         body: {schoolName , profilePic}
     } , {status: 200})

}