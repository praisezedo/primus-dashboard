import Student from "@/app/models/Students";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";
import AcademicSession from "@/app/models/AcademicSession";
import {rateLimit} from "@/lib/ratelimit";
import StudentFee from "@/app/models/StudentFee";
import FeesType from "@/app/models/FeesType";
import ClassFeeConfig from "@/app/models/ClassFeeConfig";

// for geting a particular student
export async function GET(req: Request , {params}: {params: Promise<{id: string}>}) {
    
   const ip = req.headers.get("x-forwarded-for") || "unknown";
  
   if (!rateLimit(ip , 5 , 60_000)) {
      return NextResponse.json({
          message: "Too many requests. Please try again later."
      }, {status: 429})
   }
    await connectDB();

     const { id } = await params;

    const {schoolId} = await verifyAuth();

    const student = await Student.findOne({_id: id, schoolId});

    if (!student) {
        return NextResponse.json({message: "Not Found"} , {status: 404});
    }
    return NextResponse.json(student);
}

// for updating student 
export async function PUT(req: Request , {params}: {params: Promise<{id: string}>}) {

     const { id } = await params;

    await connectDB();
    const {schoolId} = await verifyAuth();

    const body = await req.json();

    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});
    
    // Get the old student data to check if className changed
    const oldStudent = await Student.findOne({_id: id , schoolId , sessionId: activeSession?._id });

    if (!oldStudent) {
        return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }
    
    const student = await Student.findOneAndUpdate({_id: id , schoolId , sessionId: activeSession?._id } , body , {new: true , runValidators: true });

    // Update student fees if className has changed
    if (body.className && body.className !== oldStudent.className ) {
        await updateStudentFees(id, body.className , schoolId, activeSession?._id);
    }

    return NextResponse.json(student);
}

// for deleting student 
export async function DELETE(_:Request , {params}: {params: Promise<{id: string}>}) {

     const { id } = await params;

    await connectDB();

    const {schoolId} = await verifyAuth();
    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});
    
    await StudentFee.deleteMany({studentId: id , schoolId , sessionId: activeSession?._id });
    
    await Student.deleteOne({_id: id , schoolId , sessionId: activeSession?._id });
    
    return NextResponse.json({message: "Student deleted"});

}


async function updateStudentFees(studentId: string, newClassName: string, schoolId: string, sessionId: string) {
    try {

        const [feeTypes, classConfigs] = await Promise.all([
            FeesType.find({ schoolId, sessionId }),
            ClassFeeConfig.find({ schoolId, sessionId, className: newClassName })
        ]);

        if (feeTypes.length === 0) {
            console.warn(`No fee types found for schoolId: ${schoolId}, sessionId: ${sessionId}`);
            return;
        }


        const configMap = new Map<string, number>();
        for (const config of classConfigs) {
            configMap.set(config.feeTypeId.toString(), config.amount);
        }


        const bulkOps = feeTypes.map((feeType) => ({
            updateOne: {
                filter: { studentId, feeTypeId: feeType._id, schoolId, sessionId },
                update: { 
                    $set: { 
                        className: newClassName, 
                        totalAmount: configMap.get(feeType._id.toString()) || 0 ,
                        amountPaid: 0,
                        balance: configMap.get(feeType._id.toString()) || 0,
                        status: (configMap.get(feeType._id.toString()) && configMap.get(feeType._id?.toString()) || 0) > 0 ? "UNPAID" : "PAID",
                    } 
                },
                upsert: false
            }
        }));


        if (bulkOps.length > 0) {
            await StudentFee.bulkWrite(bulkOps);
        }
    } catch (error) {
        console.error(`Error updating student fees for studentId ${studentId}:`, error);
        throw error;
    }
}