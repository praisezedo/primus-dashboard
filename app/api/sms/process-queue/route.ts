import { connectDB } from "@/lib/mongodb";
import { sendBulkSMSInBatches } from "@/lib/sms/sendBulkSMSInBatches";
import { NextResponse } from "next/server";

export async function POST(){

  await connectDB();

  await sendBulkSMSInBatches(50);

  return NextResponse.json({
    processed:true
  });

}