import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import StudentFee from "@/app/models/StudentFee";
import { rateLimit } from "@/lib/ratelimit";
import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import Payment from "@/app/models/Payment";

export async function POST(req: Request) {

  const ip = req.headers.get("x-forwarded-for") || "unknown";
      
       if (!rateLimit(ip , 5 , 60_000)) {
          return NextResponse.json({
              message: "Too many requests. Please try again later."
          }, {status: 429})
       }

    try {
        await connectDB();

        const { schoolId } =  await verifyAuth();

        const {feeId , amount} = await req.json();

        if (!feeId || amount == null) {
            return NextResponse.json({message: "Missing required fields"}, {status: 400})
        };
         const fee = await StudentFee.findById(feeId);

 if (!fee) {
  return NextResponse.json(
        { message: "Fee record not found" },
        { status: 404 }
      );
  }

  const activeSession = await AcademicSession.findOne({
    schoolId,
    isActive: true
  });

    if (!activeSession) {
   return NextResponse.json(
    { message: "No active session" },
    { status: 404 }
   );
  }

   const sessionId = activeSession._id.toString();

  await Payment.create({
   schoolId,
   sessionId,
   studentId: fee.studentId,
   feeId: fee._id,
   amount
  });

  fee.amountPaid += amount;

   await fee.save();

   return NextResponse.json({ message: "Payment recorded successful" });

 } catch (error: any) {
    console.error(error);
   return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
 }
} 