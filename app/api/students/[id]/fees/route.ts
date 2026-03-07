import StudentFee from "@/app/models/StudentFee";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req: Request , { params }: {params: Promise<{id: string}>}) {
       try {
        await connectDB();

        const { schoolId } = await verifyAuth();

          const { id } = await params;

        const fees = await StudentFee.find({
            schoolId,
            studentId: id,
        }).populate("feeTypeId" , "name");

        return NextResponse.json(fees);
       } catch (error: any) {
        console.error("Error fetching student fees:", error);
     return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
     );
       }
}