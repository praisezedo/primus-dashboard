import AcademicSession from "@/app/models/AcademicSession";
import { verifyAuth } from "./auth";
import { connectDB } from "./mongodb";

export async function validateSession() {

    await connectDB()

    const {schoolId} = await verifyAuth();
    
    const activeSession = await AcademicSession.findOne({schoolId , isActive: true});

    const sessionId = activeSession.sessionId;

    return {schoolId , sessionId};
}