import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import StudentFee from "@/app/models/StudentFee";
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

  fee.amountPaid += amount;

   await fee.save();

   return NextResponse.json({ message: "Payment successful" });

 } catch (error: any) {
    console.error(error);
   return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
 }
} 