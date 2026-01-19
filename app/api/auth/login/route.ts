import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectDB} from '@/lib/mogodb'
import Admin from "@/app/models/Admin";
import { AdminType } from "@/types/admin";
export async function POST(req: Request) {

    try {

        await connectDB();

        const body = await req.json();
        const {adminEmail , adminPassword} = body as AdminType;

         //validate admin
        if (!adminEmail || !adminPassword) {
            return NextResponse.json({
                message: "Email and password are rquired"
            }, {status: 400}
        );
        }

// find admin

        const admin = await Admin.findOne({adminEmail});

        if (!admin) {
            return NextResponse.json(
                {message: "Invalid credentials"},
                {status: 401}
            );
        }

        // compare password
        const isMatch = await bcrypt.compare(
            adminPassword ,
            admin.adminPassword
        )
       if (!isMatch) {
          return NextResponse.json({
            message: "Invalid credentials"
          }, {status: 401}
        );
       }

       return NextResponse.json({
        message: "Login Successful",
        admin: {
             adminId: admin._id.toString(),
             adminName: admin.adminName,
             adminEmail: admin.adminEmail,
             schoolName: admin.schoolName,
             schoolId: admin.schoolId,
        },
       },{status: 200}
    );
    } catch (error) {
       console.error("Login error", error);
       return NextResponse.json({
         message: "Internal server error"
       } , {status: 500})
    }
} 