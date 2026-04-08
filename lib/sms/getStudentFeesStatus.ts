import StudentFee from "@/app/models/StudentFee";

export async function getStudentFeesStatus(studentId:string){

  const fees = await StudentFee.find({studentId})
  .select("status");

  if(!fees.length) return "UNPAID";

  const statuses = fees.map(f=>f.status);

  if(statuses.every(s=>s==="PAID")) return "PAID";

  if(statuses.every(s=>s==="UNPAID")) return "UNPAID";

  return "PARTIAL";
}