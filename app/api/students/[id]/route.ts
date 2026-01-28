import Student from "@/app/models/Students";
import { connectDB } from "@/lib/mongodb";
import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

// for geting a particular student
export async function GET(_: Request , {params}: {params: {id: string}}) {

    await connectDB();
    const {schoolId} = await verifyAuth();
    const student = await Student.findOne({_id: params.id, schoolId});
    if (!student) {
        return NextResponse.json({message: "Not Found"} , {status: 404});
    }
    return NextResponse.json(student);
}

// for updating student 
export async function PUT(req: Request , {params}: {params: {id: string}}) {

    await connectDB();
    const {schoolId} = await verifyAuth();
    const data = await req.json();
    const student = await Student.findOneAndUpdate({_id: params.id , schoolId} , data , {new: true});
    return NextResponse.json(student);

}

// for deleting student 
export async function DELETE(_:Request , {params}: {params: {id: string}}) {
    await connectDB();

    const {schoolId} = await verifyAuth();

    await Student.deleteOne({_id: params.id , schoolId});

    return NextResponse.json({message: "Student deleted"});
}