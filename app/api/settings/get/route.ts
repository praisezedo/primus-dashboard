import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/models/Settings";
import { NextResponse } from "next/server";

export async function GET() {
  const { schoolId } = await verifyAuth();

  const setting = await Setting.findOne({ schoolId });

  return NextResponse.json(setting);
}