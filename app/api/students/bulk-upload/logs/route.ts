import AcademicSession from "@/app/models/AcademicSession";
import BulkUploadLog from "@/app/models/BulkUpload";
import { verifyAuth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const {schoolId} = await  verifyAuth();
       const activeSession = await AcademicSession.findOne({ schoolId , isActive: true });

       if (!activeSession) {
        return NextResponse.json({
            message: "No active session found",
        }, { status: 400});
       }
        const sessionId = activeSession._id;
        
       const logs = await BulkUploadLog.find({schoolId , sessionId})
       .sort({ createdAt: -1 })
       .limit(10)
       .lean();
    
      const totalUploads =  await BulkUploadLog.countDocuments({ schoolId , sessionId});

      const successCount = await BulkUploadLog.countDocuments({ 
        schoolId,
        sessionId,
        status: "SUCCESS",
        });

        const failedCount = await BulkUploadLog.countDocuments({
            schoolId,
            sessionId,
            status: "FAILED",
        });
       
        return NextResponse.json({
            totalUploads,
            successCount,
            failedCount,
            logs,
        });
    } catch (error: any) {
        console.error("Error fetching bulk upload logs:", error);
        return NextResponse.json({
            message: "Server error",
        }, { status: 500 });
    }
}