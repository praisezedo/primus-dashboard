import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/models/Settings";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { rateLimit } from "@/lib/ratelimit";

export async function PUT(req: Request) {

 const ip = req.headers.get("x-forwarded-for") || "unknown";

 if (!rateLimit(ip , 5 , 60_000)) {
    return NextResponse.json({
        message: "Too many requests. Please try again later."
    }, {status: 429})
 }
 
    await connectDB()

    const {schoolId} = await verifyAuth();

    const body = await req.json();
    
  const updated = await Setting.findOneAndUpdate({schoolId},body,{new: true});

  return NextResponse.json(updated);
}
