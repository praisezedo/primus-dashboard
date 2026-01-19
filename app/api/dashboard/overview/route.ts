import { NextResponse } from "next/server";
import { getDashBoardOverview } from "@/lib/dashboard/overview.service";

export async function GET() {
    const adminId = 'demo-admin-id';

    const data = await getDashBoardOverview(adminId);

    return NextResponse.json(data)
}

