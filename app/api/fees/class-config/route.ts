import ClassFeeConfig from "@/app/models/ClassFeeConfig";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import AcademicSession from "@/app/models/AcademicSession";
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
        const {schoolId} = await verifyAuth();

  const activeSession = await AcademicSession.findOne({
      schoolId,
      isActive: true,
     });


         if (!activeSession) {
      return NextResponse.json(
        { message: "No active session" },
        { status: 400 }
      );
    }
        const { className , feeTypeId , amount } = await req.json();

 if (!className || !feeTypeId || amount == null) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
      const config = await ClassFeeConfig.findOneAndUpdate(
            {
                schoolId ,
                sessionId: activeSession._id ,
                className ,
                feeTypeId,
            },
            {amount},
            {upsert: true , new: true}
        );

        return NextResponse.json(config);
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}


export async function GET(_req: Request) {
  try {
    await connectDB();
    const { schoolId } = await verifyAuth();

    const activeSession = await AcademicSession.findOne({ schoolId, isActive: true });

    if (!activeSession) {
      return NextResponse.json(
        { message: "No active session" },
        { status: 400 }
      );
    }

    const configs = await ClassFeeConfig.find({
      schoolId,
      sessionId: activeSession._id,
    });

    return NextResponse.json(configs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
