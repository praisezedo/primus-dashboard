import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import AcademicSession from "@/app/models/AcademicSession";
import Payment from "@/app/models/Payment";
import { NextResponse } from "next/server"; 

export async function GET() {
    try {
        await connectDB();

        const { schoolId } = await verifyAuth();

        const activeSession = await AcademicSession.findOne({
            schoolId,
            isActive: true,
        });

        const sessionId = activeSession?._id.toString();

        const payments = await Payment.find({
            schoolId,
            sessionId,
        })
        .sort({ createdAt: -1 })
        .limit(10)
        .populate("studentId", "studentName className section");

        return NextResponse.json(payments);

    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            {message: "Failed to fetch recent payments"},
            {status: 500}
        );
    }
}
