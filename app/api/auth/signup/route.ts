import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import { v4 as uuidv4 } from "uuid";
import { sendWelcomeEmail } from "@/lib/email";
import { rateLimit } from "@/lib/ratelimit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {

   const ip = req.headers.get("x-forwarded-for") || "unknown";
  
   if (!rateLimit(ip , 5 , 60_000)) {
      return NextResponse.json({
          message: "Too many requests. Please try again later."
      }, {status: 429})
   }
   
  try {
    await connectDB();

    const { adminName, adminEmail, schoolName, adminPassword } = await req.json();

    if (!adminName || !adminEmail || !adminPassword || !schoolName) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    //  Email format validation
    if (!EMAIL_REGEX.test(adminEmail)) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 400 }
      );
    }
    const existingAdmin = await Admin.findOne({ adminEmail });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin already exists" },
        { status: 409 }
      );
    }

 const hashedPassword = await bcrypt.hash(adminPassword, 10);

 const schoolId = uuidv4();


await Admin.create({
  adminName,
  adminEmail,
  schoolName,
  password: hashedPassword,
  schoolId,
});

    // Send welcome email
    try {
       await sendWelcomeEmail(adminEmail , adminName , schoolName , schoolId);  
    } catch (emailError:any) {
        console.error("Error sending welcome email:", emailError?.message || emailError);
    }

    return NextResponse.json(
      {
        message: "Admin created successfully",
        admin: {
          adminName,
          adminEmail,
          schoolName,
          schoolId,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
