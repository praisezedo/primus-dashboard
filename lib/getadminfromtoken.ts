import AcademicSession from "@/app/models/AcademicSession";
import { verifyAuth } from "./auth";

export async function getAdminFromToken() {

      const {schoolId} : {schoolId: string} = await verifyAuth();

      const session = await AcademicSession.findOne({schoolId});
      
      if (!session) {
           throw new Error("UnAuthorized !!");
      } 
      const sessionId: string = session.sessionId;

     return {schoolId  , sessionId} 
}