import AcademicSession from "@/app/models/AcademicSession";
import { NextResponse } from "next/server";
import Student from "@/app/models/Students";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/app/models/Admin";
import StudentFee from "@/app/models/StudentFee";

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
        {message: "No active academic session found"},
        {status: 404}
    );
 };
const sessionId = activeSession._id.toString();

const totalStudents = await Student.countDocuments({
    schoolId,
    sessionId,
});

const admin = await Admin.findOne({schoolId});

const feesAgg = await StudentFee.aggregate([
    {
        $match: {
            schoolId,
            sessionId,
        }
    }, 
    {
        $group: {
            _id: null,
            totalExpected: { $sum: "$totalAmount" },
            totalPaid: { $sum: "$amountPaid" },
            totalBalance: { $sum: "$balance" },
        }
    }
]);

const totals = feesAgg[0] ||  {
    totalExpected: 0,
    totalPaid: 0,
    totalBalance: 0,
};

const studentsWithDebt = await StudentFee.aggregate([
    {
        $match: {
            schoolId,
            sessionId,
            balance: { $gt: 0 },
        }
    },
    {
        $lookup: {
            from: "students",
            localField: "studentId",
            foreignField: "_id",
            as: "student"
        }
    },
    {
        $match: {
            "student.0": { $exists: true }
        }
    },
    {
        $group: {
            _id: "$studentId",
        }
    },
    {
        $count: "count"
    }
]);

const debtCount = studentsWithDebt[0]?.count || 0;

return NextResponse.json({
 totalStudents,
 totalExpected: totals.totalExpected,
 totalPaid: totals.totalPaid,
 totalBalance: totals.totalBalance,
 studentsWithDebt: debtCount,
 adminName: admin?.adminName || "Admin"
});
} catch (error: any) {
    console.error(error);
 return NextResponse.json(
 { message: "Server error" },
 { status: 500 }
);
} 

}