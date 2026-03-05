import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import {parse} from "csv-parse/sync"
import AcademicSession from "@/app/models/AcademicSession";
import Student from "@/app/models/Students";
import mongoose from "mongoose";
import Setting from "@/app/models/Settings";
import BulkUploadLog from "@/app/models/BulkUpload";
import { rateLimit } from "@/lib/ratelimit";
import FeesType from "@/app/models/FeesType";
import ClassFeeConfig from "@/app/models/ClassFeeConfig";
import StudentFee from "@/app/models/StudentFee";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NIGERIA_PHONE_REGEX = /^0[789][01]\d{8}$/;

let errorRow: number = 0;

export async function POST(req: Request) {
       let activeSession: any = null;
       let schoolId: string | null = null;
       
     const ip = req.headers.get("x-forwarded-for") || "unknown";
    
     if (!rateLimit(ip , 5 , 60_000)) {
        return NextResponse.json({
            message: "Too many requests. Please try again later."
        }, {status: 429})
     }

     await connectDB();

     const auth = await verifyAuth();

     schoolId = auth.schoolId;
        
     activeSession = await AcademicSession.findOne({schoolId , isActive: true})
     const settings = await Setting.findOne({schoolId});



     if(!activeSession) {
        return NextResponse.json({
            message: "No active session",
        } , {status: 400});
     }

     const feeTypes = await FeesType.find({schoolId , sessionId: activeSession._id });

      if (feeTypes.length === 0) {
        return NextResponse.json({
            message: "Please configure fee type in settings before uploading students. "
        }, {status: 400});
      }

    const classConfigs = await ClassFeeConfig.find({
    schoolId,
    sessionId: activeSession._id,
    });

    if (classConfigs.length === 0) {
    return NextResponse.json({
        message: "Please configure Class Fee Settings before uploading students."
    }, { status: 400 });
    }
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


     if (!settings) {
          return NextResponse.json({
             message: "School settings not configured",
          } , {status: 400});
     }

     const allowedClasses = settings.classes || [];
     const allowedSections = settings.sections || [];


     const seenStudentIds = new Set();
     const studentsToInsert: any[] = [];
try   {
    for (let index = 0; index < records.length; index++) {
    const row: any = records[index];
    const rowNumber = index + 2;
        errorRow = rowNumber;
    const studentId = row["STUDENT ID"]?.trim();


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

    if (row["CLASS"] && !allowedClasses.includes(row["CLASS"])) {
        return NextResponse.json({
            message: `Row ${rowNumber}: CLASS must be one of: ${allowedClasses.join(", ")}`,
        }, {status: 400});
    }

    if (row["SECTION"] && !allowedSections.includes(row["SECTION"])) {
          return NextResponse.json({
            message: `Row ${rowNumber}: SECTION must be one of: ${allowedSections.join(", ")}`,
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
        sessionId: activeSession._id,
        studentName: row["STUDENT NAME"],
        studentId,
        className: row["CLASS"],
        section: row["SECTION"],
        parentName: row["PARENT NAME"],
        parentPhone: row["PARENT PHONE"],
        parentEmail: row["PARENT EMAIL"],
        smsStatus: notify ? "PENDING" : "FAILED",
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

    let insertedStudents: any[] = [];

    await session.withTransaction(async () => {
       insertedStudents = await Student.insertMany(studentsToInsert , { session });

      const feeTypes = await FeesType.find({ schoolId }).session(session);

 const classConfigs = await ClassFeeConfig.find({
    schoolId,
    sessionId: activeSession._id,
     }).session(session);

     const configMap = new Map<string , number>();
     
     for (const config of classConfigs) {
        const key = `${config.className}_${config.feeTypeId}`;
        configMap.set(key , config.amount);
     }

      for (const student of insertedStudents) {

        for (const feeType of feeTypes) {

            const key = `${student.className}_${feeType._id}`;
            const amount = configMap.get(key) || 0;
            
            if (!amount || amount <= 0) continue;

            await StudentFee.create([{
                  schoolId,
                  sessionId: activeSession._id,
                   studentId: student._id,
                   className: student.className,
                     feeTypeId: feeType._id,
                   totalAmount: amount,
                    amountPaid: 0,
                   balance: amount,
            }], { session });

        }
      }

    });
    
    await BulkUploadLog.create({
         schoolId,
         sessionId: activeSession._id,
         status: "SUCCESS",
         totalRows: records.length,
         insertedRows: studentsToInsert.length,
         notifyParents: notify,
    }) 

    return NextResponse.json({
        message: "Bulk upload successful",
        inserted: studentsToInsert.length,
    });

   } 
    catch (error: any)  {

   if (schoolId && activeSession) {
        await BulkUploadLog.create({
        schoolId,
        sessionId: activeSession._id,
        status: "FAILED",
        totalRows: records.length,
        insertedRows: 0,
        errorRow,
        errorMessage: error.message,
        notifyParents: notify,
    });
   }

 return NextResponse.json(
        {message: error.message || "Bulk upload failed"},
    {status: 400}
    )
}  


}
