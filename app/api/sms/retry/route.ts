import AcademicSession from "@/app/models/AcademicSession";
import Setting from "@/app/models/Settings";
import Student from "@/app/models/Students";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { sendSMS } from "@/lib/sms";
import { renderSmsTemplate } from "@/lib/sms/renderTemplate";
import { generateFeesSummary } from "@/lib/sms/generateFeesSummary";
import { getStudentFeesStatus } from "@/lib/sms/getStudentFeesStatus";
import { compressMessage } from "@/lib/sms/compressMessage";
import { NextResponse } from "next/server";

export async function POST() {

  await connectDB();

  const { schoolId } = await verifyAuth();

  const activeSession = await AcademicSession.findOne({
    schoolId,
    isActive: true
  });

  const failedStudents = await Student.find({
    schoolId,
    sessionId: activeSession._id,
    smsStatus: "FAILED",
    smsAttempts: { $lt: 3 }
  }).limit(20);

  const settings = await Setting.findOne({ schoolId });

  for (const student of failedStudents) {

    const feesSummary = await generateFeesSummary(student._id);

    const feesStatus = await getStudentFeesStatus(student._id);

    let template = settings.smsTemplate.unpaid;

    if (feesStatus === "PAID") {
      template = settings.smsTemplate.paid;
    }

    if (feesStatus === "PARTIAL") {
      template = settings.smsTemplate.partial;
    }

    const message = renderSmsTemplate(
      template,
      {
        parentName: student.parentName,
        studentName: student.studentName,
        studentId: student.studentId,
        className: student.className,
        section: student.section,
        semester: settings.semester,
        feesSummary
      }
    );

    const finalMessage = compressMessage(message);

    try {

      await sendSMS(student.parentPhone, finalMessage);

      student.smsStatus = "SENT";
      student.smsAttempts = 0;

      await student.save();

    } catch {

      student.smsAttempts += 1;
      student.lastSmsAttemptAt = new Date();

      await student.save();

    }

  }

  return NextResponse.json({
    retried: failedStudents.length
  });
}