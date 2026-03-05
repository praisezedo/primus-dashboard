import StudentFee from "@/app/models/StudentFee";
import { connectDB } from "@/lib/mongodb";
import { rateLimit } from "@/lib/ratelimit";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {id: string } }
) {
 const ip = req.headers.get("x-forwarded-for") || "unknown";
        
         if (!rateLimit(ip , 5 , 60_000)) {
            return NextResponse.json({
                message: "Too many requests. Please try again later."
            }, {status: 429})
         }  
         
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