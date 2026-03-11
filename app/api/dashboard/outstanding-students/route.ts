import { verifyAuth } from "@/lib/auth";
import AcademicSession from "@/app/models/AcademicSession";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import StudentFee from "@/app/models/StudentFee";

export async function GET() {
    try {
        await  connectDB();
        const { schoolId } = await verifyAuth();

        const activeSession = await AcademicSession.findOne({
            schoolId,
            isActive: true,
        });

        if (!AcademicSession) {
            return NextResponse.json(
                {message: "No active academic session found"},
                {status: 404}
            );
        }

        const sessionId = activeSession._id.toString();

        const outstandingStudents = await StudentFee.aggregate([
            {
                $match: {
                    schoolId,
                    sessionId,
                    balance: { $gt: 0 }
                }
            },
            {
                $group: {
                    _id: "$studentId",
                    totalAmount: {$sum: "$totalAmount"},
                    totalPaid: {$sum: "$amountPaid"},
                    totalBalance: {$sum: "$balance"},
                }
            },
            {
                $lookup: {
                    from: "students",
                    localField: "_id",
                    foreignField: "_id",
                    as: "student",
                }
            },
            {
                $unwind: "$student"
            },
            {
                $project: {
                    studentName: "$student.studentName",
                    className: "$student.className",
                    section: "$student.section",
                    totalAmount: 1,
                    totalPaid: 1,
                    balance: "$totalBalance"
                }
            }, 
            {
                $sort: { balance: -1 }
            },
            {
                $limit: 10
            }
        ]);

        return NextResponse.json({
            students: outstandingStudents,
        });
    } catch (error: any) {

        console.error("Error fetching outstanding students:", error);

        return NextResponse.json(
            { message: "Error fetching outstanding students"},
            { status: 500 }
        );
    } 
}