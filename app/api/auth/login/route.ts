import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectDB} from '@/lib/mongodb'
import Admin from "@/app/models/Admin";
import { AdminType } from "@/types/admin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

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
            admin.password
        )
       if (!isMatch) {
          return NextResponse.json({
            message: "Invalid credentials"
          }, {status: 401}
        );
       }



    const token = jwt.sign (
        {
            adminId: admin.adminId,
            schoolId: admin.schoolId,
        },
       process.env.JWT_SECRET!,

       {expiresIn: "7d"}
    );
    
    (await cookies()).set("primus_token" , token , {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

       return NextResponse.json({
        message: "Login Successful",
        token,
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