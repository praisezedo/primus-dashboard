import { connectDB } from "@/lib/mongodb";
import { sendBulkSMSInBatches } from "@/lib/sms/sendBulkSMSInBatches";
import { NextResponse } from "next/server";

export async function POST(){

  try {
    await connectDB();
    console.log("[SMS QUEUE] Starting to process SMS queue...");

    await sendBulkSMSInBatches(50);

    console.log("[SMS QUEUE] ✓ Queue processing completed successfully");
    return NextResponse.json({
      processed:true,
      message: "SMS queue processed successfully"
    });
  } catch (error: any) {
    console.error("[SMS QUEUE] ✗ Error processing queue:", error?.message);
    return NextResponse.json({
      processed: false,
      error: error?.message || "Failed to process queue"
    }, { status: 500 });
  }

}