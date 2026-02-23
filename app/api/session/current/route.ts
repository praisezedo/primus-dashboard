
import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Session } from "@/components/types/session";

export async function GET() {

    await connectDB();
    
    const {schoolId} = await verifyAuth();

    const session: Session | null = await AcademicSession.findOne({
        schoolId,
        isActive: true
    })

    if (!session) {
        return NextResponse.json({session: null});
    }

    return NextResponse.json(session);
}