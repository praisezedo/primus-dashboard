import AcademicSession from "@/app/models/AcademicSession";
import Setting from "@/app/models/Settings";
import Student from "@/app/models/Students";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { sendSMS } from "@/lib/sms";
import { NextResponse } from "next/server";

export async function POST() {

    await connectDB();

  const { schoolId } = await verifyAuth();

 const activeSession = await AcademicSession.findOne({schoolId , isActive: true});

    const failedStudents = await Student.find({
        schoolId,
        sessionId: activeSession._id,
        smsStatus: "FAILED",
        smsAttempts: {$lt: 3},
     }).limit(20);

     const settings = await Setting.findOne({schoolId});

  for (const student of failedStudents) {

    const message: string = student.feesStatus === "PAID" 
                  ?settings.smsTemplate.paid
                  : settings.smsTemplate.unpaid
      try {
        await sendSMS(student.parentPhone, message);
        student.smsStatus = "SENT";
        student.smsAttempts = 0;
        await student.save();
      } catch {
        student.smsAttempts += 1;
        student.lasSmsAttemptAt = new Date();
        await student.save();
      }
  }
  return NextResponse.json({
    retried: failedStudents.length,
  })
}

