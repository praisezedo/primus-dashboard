import AcademicSession from "@/app/models/AcademicSession";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import StudentFee from "@/app/models/StudentFee";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const { schoolId } = await verifyAuth();

    const activeSession = await AcademicSession.findOne({
      schoolId,
      isActive: true,
    });

    if (!activeSession) {
      return NextResponse.json(
        { message: "No active academic session found" },
        { status: 404 }
      );
    }

    const sessionId = activeSession._id.toString();

    // Get fee totals efficiently
    const feeTotalsAgg = await StudentFee.aggregate([
      {
        $match: { schoolId, sessionId }
      },
      {
        $group: {
          _id: null,
          totalPaid: { $sum: "$amountPaid" },
          totalBalance: { $sum: "$balance" },
          totalExpected: { $sum: "$totalAmount" }
        }
      }
    ]);

    const feeTotals = feeTotalsAgg[0] || {
      totalPaid: 0,
      totalBalance: 0,
      totalExpected: 0
    };

    // Get fees by class (using className field directly from StudentFee)
    const classFeesAgg = await StudentFee.aggregate([
      {
        $match: {
          schoolId,
          sessionId,
          className: { $ne: null } // Only include records with className
        }
      },
      {
        $group: {
          _id: "$className",
          paid: { $sum: "$amountPaid" },
          balance: { $sum: "$balance" },
          expected: { $sum: "$totalAmount" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 } // Sort by className
      }
    ]);

    const classFees = classFeesAgg.map(c => ({
      className: c._id,
      paid: c.paid,
      balance: c.balance,
      expected: c.expected,
      studentCount: c.count
    }));

 console.log("feeTotalsAgg", feeTotalsAgg);
console.log("classFeesAgg", classFeesAgg);
    return NextResponse.json({
      feeTotals,
      classFees
    });

  } catch (error: any) {
    console.error("Chart data error:", error);
    return NextResponse.json(
      { message: "Error fetching chart data", error: error.message },
      { status: 500 }
    );
  }
}