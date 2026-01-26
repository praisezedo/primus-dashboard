
import { verifyAuth } from "@/lib/auth";
import Setting from "@/app/models/Settings";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";

export async function POST(req: Request) {

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

