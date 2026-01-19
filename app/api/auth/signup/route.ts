import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mogodb";
import Admin from "@/app/models/Admin";
import Setting from "@/app/models/Settings";
import { AdminType } from "@/types/admin";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request , {}) {
     try {
        await connectDB();

        const body: AdminType = await req.json();
        const {adminName , adminEmail , schoolName , adminPassword} = body;
        
        if(!adminName || !adminEmail || !adminPassword || !schoolName) {
            return NextResponse.json(
                {message: "All fields are required"},
                {status: 400}
            )
        };

        const existingAdim = await Admin.findOne({adminEmail: adminEmail})
         if (existingAdim) {
            return NextResponse.json(
                {message: "Admin already exists"},
                {status: 409}
            );
         }

         // hash password
         const hashedPassword = await bcrypt.hash(adminPassword , 10);

         //Generate schoolId
         const schoolId: string = uuidv4();

         const admin = await Admin.create({
            adminName,
            adminEmail,
            schoolName,
            adminPassword: hashedPassword,
            schoolId
         });

         const settings = await Setting.create({
              schoolId,
              classes: [],
              section: [],
              semester: "",
              academicYear: "",
              smsTemplate: {
                 paid: "Your ward school fees has been paid successfully.",
                 unpaid: "your school fees has not been paid.",
              }
         });

         return NextResponse.json({
            message: "Admin created sucessfully",
            admin: {
                 adminName: admin.adminName,
                 adminEmail: admin.adminEmail,
                 schoolName: admin.schoolName,
                 adminId: admin._id.toString(),
                 schoolId
            },
         },
          {status: 201}
        );
         
     } catch (error) {

      console.error("Signup error:" , error);
      
      return NextResponse.json({
        message: "Internal Server error"
      }, {status: 500}
    );
}
} 