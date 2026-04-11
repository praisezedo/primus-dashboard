import AcademicSession from "@/app/models/AcademicSession";
import Student from "@/app/models/Students";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { sendSMS } from "@/lib/sms";
import { buildStudentSms } from "@/lib/sms/buildStudentSms";
import { getStudentFeesStatus } from "@/lib/sms/getStudentFeesStatus";
import { NextResponse } from "next/server";

const VALID_STATUS = ["PAID", "UNPAID", "PARTIAL"];

export async function POST(req: Request) {
  await connectDB();

  const { schoolId } = await verifyAuth();

  const activeSession = await AcademicSession.findOne({
    schoolId,
    isActive: true,
  });

  if (!activeSession) {
    return NextResponse.json(
      { message: "No active academic session." },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { studentId, status } = body;

  if (!studentId && !status) {
    return NextResponse.json(
      { message: "studentId or status is required." },
      { status: 400 }
    );
  }

  let students = [] as any[];

  if (studentId) {
    const student = await Student.findOne({
      _id: studentId,
      schoolId,
      sessionId: activeSession._id,
    });
    if (!student) {
      return NextResponse.json({ message: "Student not found." }, { status: 404 });
    }
    students = [student];
  } else {
    if (!VALID_STATUS.includes(status)) {
      return NextResponse.json(
        { message: "Status must be PAID, UNPAID, or PARTIAL." },
        { status: 400 }
      );
    }

    const allStudents = await Student.find({
      schoolId,
      sessionId: activeSession._id,
    });

    for (const student of allStudents) {
      const currentStatus = await getStudentFeesStatus(student._id.toString());
      if (currentStatus === status) {
        students.push(student);
      }
    }
  }

  if (students.length === 0) {
    return NextResponse.json(
      { message: "No students found for this request.", total: 0 },
      { status: 200 }
    );
  }

  let sent = 0;
  let failed = 0;

  for (const student of students) {
    if (!student.parentPhone) {
      failed += 1;
      continue;
    }

    try {
      const message = await buildStudentSms(student, schoolId);
      await sendSMS(student.parentPhone, message);

      student.smsStatus = "SENT";
      student.smsAttempts = 0;
      await student.save();
      sent += 1;
    } catch (error: any) {
      student.smsStatus = "FAILED";
      student.smsAttempts += 1;
      student.lastSmsAttemptAt = new Date();
      await student.save();
      failed += 1;
    }
  }

  return NextResponse.json({
    total: students.length,
    sent,
    failed,
  });
}
