import { connectDB } from "@/lib/mongodb";
import Payment from "@/app/models/Payment";
import { NextResponse } from "next/server";

export async function GET(
    _req: Request,
    { params }: {params: Promise<{feeId: string}>}
) {
   try {
    
    await connectDB();

    const { feeId } = await params;

    const payments = await Payment.find({
        feeId: feeId
    })
    .sort({ createdAt: -1 })
    .limit(10); 

    return NextResponse.json(payments);

   } catch (error: any) {
        console.error(error);
      return NextResponse.json(
   { message: "Failed to fetch payment history" },
   { status: 500 }
  );
   }
}