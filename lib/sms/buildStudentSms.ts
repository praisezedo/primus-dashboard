import Admin from "@/app/models/Admin";
import Setting from "@/app/models/Settings";
import { renderSmsTemplate } from "./renderTemplate";
import { generateFeesSummary } from "./generateFeesSummary";
import { getStudentFeesStatus } from "./getStudentFeesStatus";

export async function buildStudentSms(student:any,schoolId:string){

const admin = await Admin.findOne({schoolId}).lean();
const settings = await Setting.findOne({schoolId}).lean();
  const summary = await generateFeesSummary(student._id);

  const status = await getStudentFeesStatus(student._id);

  let template = settings.smsTemplate.unpaid;

  if(status==="PAID") template=settings.smsTemplate.paid;

  if(status==="PARTIAL") template=settings.smsTemplate.partial;

  const message = renderSmsTemplate(
    template,
    {
      parentName: student.parentName,
      studentName: student.studentName,
      studentId: student.studentId,
      className: student.className,
      section: student.section,
      semester: settings.semester,
      feesSummary: summary
    }
  );

  return `${admin.schoolName}\n\n${message}`;

}