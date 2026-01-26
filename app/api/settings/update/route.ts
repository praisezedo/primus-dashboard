import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/models/Settings";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function PUT(req: Request) {

    await connectDB()

    const {schoolId} = await verifyAuth();

    const body = await req.json();
    
  const updated = await Setting.findOneAndUpdate({schoolId},body,{new: true});

  return NextResponse.json(updated);
}
