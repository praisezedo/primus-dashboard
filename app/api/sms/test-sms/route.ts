import { sendSMS } from "@/lib/sms";    
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await sendSMS("07050243807", "PRIMUS: SMS is working!");

    return NextResponse.json({
      success: true,
      message: "SMS sent",
    });
    console.log("Test SMS sent successfully");
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}