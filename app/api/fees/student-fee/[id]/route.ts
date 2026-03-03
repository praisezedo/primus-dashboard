import StudentFee from "@/app/models/StudentFee";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {id: string } }
) {
    try {
        await connectDB();

        const { amount } = await req.json();
        const fee = await StudentFee.findById(params.id);

        if (!fee) {
            return NextResponse.json({error: "Fee not found"}, {status: 404});
        }

        fee.amountPaid += amount;
        await fee.save();
        return NextResponse.json(fee);

    } catch (error: any) {
         return NextResponse.json({error: error.message} , { status: 500 })
    }
}