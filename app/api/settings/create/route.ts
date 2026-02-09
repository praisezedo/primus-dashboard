
import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/models/Settings";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {

     const ip = req.headers.get("x-forwarded-for") || "unknown";
    
     if (!rateLimit(ip , 5 , 60_000)) {
        return NextResponse.json({
            message: "Too many requests. Please try again later."
        }, {status: 429})
     }

    await connectDB()

    const {schoolId} = await verifyAuth();

    const body = await req.json();

    const exists = await Setting.findOne({schoolId});

    if(exists) {
        return  NextResponse.json({
            message: "Settings already exist"
        } ,{status: 400} );
    }

    const settings = await Setting.create({
        schoolId,
        classes: body.classes,
       sections: body.sections,
       semester: body.semester,
       smsTemplate: body.smsTemplate,
       settingsCompleted: true,
    });

    await Admin.updateOne({schoolId}, {hasCompletedSetup: true})

    return NextResponse.json({settings} , {status: 200});
}

