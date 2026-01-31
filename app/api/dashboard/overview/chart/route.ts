import { connectDB } from "@/lib/mongodb";

import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import Student from "@/app/models/Students";
import AcademicSession from "@/app/models/AcademicSession";

export async function GET() {
  await connectDB();

  const { schoolId } = await verifyAuth();

  const activeSession = await AcademicSession.findOne({
    schoolId,
    isActive: true,
  });

  if (!activeSession) {
    return NextResponse.json(
      { message: "No active session" },
      { status: 400 }
    );
  }

  const sessionId = activeSession._id.toString();

  const totalStudents = await Student.countDocuments({
    schoolId,
    sessionId
  });

  const feesAgg = await Student.aggregate([
    { $match: { schoolId, sessionId } },
    { $group: { _id: "$feesStatus", count: { $sum: 1 } } },
  ]);

const classFeesAgg = await Student.aggregate([
  { $match: { schoolId, sessionId } },
  {
    $group: {
      _id: {
        className: "$className",
        feesStatus: "$feesStatus",
      },
      count: { $sum: 1 },
    },
  },
]);

// Transform aggregation result → grouped format
const classMap: Record<string, any> = {};

classFeesAgg.forEach(item => {
  const className = item._id.className || "Unknown";
  const status = item._id.feesStatus;

  if (!classMap[className]) {
    classMap[className] = {
      className,
      PAID: 0,
      UNPAID: 0,
    };
  }

  classMap[className][status] = item.count;
});

const studentsByClassGrouped = Object.values(classMap);

return NextResponse.json({
  totalStudents,
  fees: {
    PAID: feesAgg.find(f => f._id === "PAID")?.count || 0,
    UNPAID: feesAgg.find(f => f._id === "UNPAID")?.count || 0,
  },
  studentByClass: studentsByClassGrouped,
});

}
