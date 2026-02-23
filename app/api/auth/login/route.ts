import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {connectDB} from '@/lib/mongodb'
import Admin from "@/app/models/Admin";
import { AdminType } from "@/components/types/admin";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
 const ip = req.headers.get("x-forwarded-for") || "unknown";

 if (!rateLimit(ip , 5 , 60_000)) {
    return NextResponse.json({
        message: "Too many requests. Please try again later."
    }, {status: 429})
 }

    try {

        await connectDB();

        const body = await req.json();
        const {adminEmail , adminPassword} = body as AdminType;

         //validate admin
        if (!adminEmail || !adminPassword) {
            return NextResponse.json({
                message: "Email and password are required"
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
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
    })

    console.log("Cookies:", (await cookies()).getAll());
    
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