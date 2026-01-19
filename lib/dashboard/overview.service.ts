import { DashboardOverview } from "@/types/dashboard";

export async function getDashBoardOverview(_adminId:string): Promise<DashboardOverview> {

     return {
        totalStudents: 320,
        paidStudents: 210,
        unPaidStudents: 110
     }
}