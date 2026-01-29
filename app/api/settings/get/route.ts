import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/models/Settings";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
    
    await connectDB()

  const { schoolId } = await verifyAuth();

  const setting = await Setting.findOne({ schoolId });

  return NextResponse.json(setting);
}