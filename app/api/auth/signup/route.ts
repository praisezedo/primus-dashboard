import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import Setting from "@/app/models/Settings";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { adminName, adminEmail, schoolName, adminPassword } =
      await req.json();

    if (!adminName || !adminEmail || !adminPassword || !schoolName) {
      return NextResponse.json(
        { message: "All fields are required" },
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

await Setting.create({
  schoolId,
  classes: [],
  sections: [],
  semester: "",
  academicYear: "",
  smsTemplate: {
    paid: "...",
    unpaid: "...",
  },
});


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
