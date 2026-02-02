import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {parse} from "csv-parse/sync"
import AcademicSession from "@/app/models/AcademicSession";
import Student from "@/app/models/Students";
import mongoose from "mongoose";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIGERIA_PHONE_REGEX = /^0[789][01]\d{8}$/;

export async function POST(req: Request) {

     await connectDB();

     const {schoolId} = await verifyAuth();

    const  formData  = await req.formData();

    const notify = String(formData.get("notify")) === "true";
    
    const file = formData.get("file") as File;
     if (!file) {
        return NextResponse.json({message: "CSV file required"} , {status: 400});
     }
     const csvText = await file.text();
     let records;
     try {
        records = parse(csvText , {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });
     } catch {
        return NextResponse.json(
            {message: "Invalid CSV format"},
            {status: 400}
        );
     }

     const activeSession = await AcademicSession.findOne({schoolId , isActive: true})

     if(!activeSession) {
        return NextResponse.json({
            message: "No active session",
        } , {status: 400});
     }

     const seenStudentIds = new Set();
     const studentsToInsert: any[] = [];

for (let index = 0; index < records.length; index++) {
    const row: any = records[index];
    const rowNumber = index + 2;
    
    const studentId = row["STUDENT ID"]?.trim();
    const feesStatus = row["FEES STATUS"]?.toUpperCase();

    if(!studentId) {
        return NextResponse.json({
            message: `Row ${rowNumber}: STUDENT ID is required`
        }, {status: 400});   
    }
    
    if (seenStudentIds.has(studentId)) {
        return NextResponse.json({
            message: `Row ${rowNumber}: Duplicate STUDENT ID in CSV`
        }, {status: 400});   
    }

    seenStudentIds.add(studentId);

    if(!["PAID", "UNPAID"].includes(feesStatus)) {
        return NextResponse.json({
            message: `Row ${rowNumber}: FEES STATUS must be PAID or UNPAID`
        }, {status: 400});   
    }  

    if (row["PARENT EMAIL"] && !EMAIL_REGEX.test(row["PARENT EMAIL"])) {
        return NextResponse.json({
            message: `Row ${rowNumber}: Invalid email format`
        }, {status: 400});
    }

    let phone = row["PARENT PHONE"];

    if (!phone) {
        return NextResponse.json({
            message: `Row ${rowNumber}: PARENT PHONE is required`
        }, {status: 400});
    }
    

    if (!NIGERIA_PHONE_REGEX.test(phone)) {
        return NextResponse.json({
            message: `Row ${rowNumber}: Phone must be Nigerian format (e.g., 08012345678)`
        }, {status: 400});
    }

    if (!row["STUDENT NAME"]) {
        return NextResponse.json({
            message: `Row ${rowNumber}: STUDENT NAME is required`
        }, {status: 400});
    }

    if (!row["CLASS"]) {
        return NextResponse.json({
            message: `Row ${rowNumber}: CLASS is required`
        }, {status: 400});
    }

    studentsToInsert.push({
        schoolId,
        sessionId: activeSession._id.toString(),
        studentName: row["STUDENT NAME"],
        studentId,
        className: row["CLASS"],
        section: row["SECTION"],
        parentName: row["PARENT NAME"],
        parentPhone: row["PARENT PHONE"],
        parentEmail: row["PARENT EMAIL"],
        feesStatus,
        smsStatus: notify ? "PENDING" : "NOTSENT",
    });
};

    const existing = await Student.find({
        schoolId,
        sessionId: activeSession._id,
        studentId: {$in: [...seenStudentIds]},
    });

   if (existing.length > 0) {
    return NextResponse.json(
        { message: `Duplicate studentId already exists: ${existing[0].studentId}`},
        {status: 400}
    )
   }

   const session = await mongoose.startSession();

   try {
    await session.withTransaction(async () => {
        await Student.insertMany(studentsToInsert , {session});
    });

    return NextResponse.json({
        message: "Bulk upload successful",
        inserted: studentsToInsert.length,
    });
   }  catch (err: any) {
    return NextResponse.json(
        {message: err.message || "Bulk upload failed"},
        {status: 400}
    );
   } finally {
    session.endSession();
   }
}