import FeesType from "@/app/models/FeesType";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { rateLimit }  from "@/lib/ratelimit";

export async function POST(req: Request) {

      const ip = req.headers.get("x-forwarded-for") || "unknown";
     
      if (!rateLimit(ip , 5 , 60_000)) {
         return NextResponse.json({
             message: "Too many requests. Please try again later."
         }, {status: 429})
      }  

    try {
        await connectDB();

        const { schoolId } = await verifyAuth();


        const activeSession = await AcademicSession.findOne({ schoolId, isActive: true });
        if (!activeSession) {
            return NextResponse.json({ message: "No active session" }, { status: 400 });
        }

        const { name }: { name: string } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name required" }, { status: 400 });
        }

        const exists = await FeesType.findOne({
            schoolId,
            sessionId: activeSession._id,
            name,
        });

        if (exists) {
            return NextResponse.json(
                { message: "Fee type already exists" },
                { status: 400 }
            );
        }

        const feeType = await FeesType.create({
            schoolId,
            sessionId: activeSession._id,
            name,
        });

        return NextResponse.json(feeType, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(_req: Request) {
    try {
        await connectDB();
        const { schoolId } = await verifyAuth();

        const activeSession = await AcademicSession.findOne({ schoolId, isActive: true });
        if (!activeSession) {
            return NextResponse.json({ message: "No active session" }, { status: 400 });
        }

        const feeTypes = await FeesType.find({ schoolId, sessionId: activeSession._id }).sort({ createdAt: -1 });

        return NextResponse.json(feeTypes);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {

         const ip = req.headers.get("x-forwarded-for") || "unknown";
        
         if (!rateLimit(ip , 5 , 60_000)) {
            return NextResponse.json({
                message: "Too many requests. Please try again later."
            }, {status: 429})
         }  

  await connectDB();
  const { schoolId } = await verifyAuth();
  const { id } = await req.json();

  const activeSession = await AcademicSession.findOne({ schoolId, isActive: true });
  if (!activeSession) {
    return NextResponse.json({ message: "No active session" }, { status: 400 });
  }

  await FeesType.deleteOne({ _id: id, schoolId, sessionId: activeSession._id });

  return NextResponse.json({ message: "Deleted" });
}