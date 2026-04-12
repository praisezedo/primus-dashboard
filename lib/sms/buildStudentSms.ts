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

  let template = Array.isArray(settings) ? settings[0]?.smsTemplate?.unpaid : settings?.smsTemplate?.unpaid;

  if(status==="PAID") template = Array.isArray(settings) ? settings[0]?.smsTemplate?.paid : settings?.smsTemplate?.paid;

  if(status==="PARTIAL") template = Array.isArray(settings) ? settings[0]?.smsTemplate?.partial : settings?.smsTemplate?.partial;

  const message = renderSmsTemplate(
    template,
    {
      parentName: student.parentName,
      studentName: student.studentName,
      studentId: student.studentId,
      className: student.className,
      section: student.section,
      semester: Array.isArray(settings) ? settings[0]?.semester : settings?.semester,
      feesSummary: summary
    }
  );

  const adminData = Array.isArray(admin) ? admin[0] : admin;
  return `${adminData?.schoolName}\n\n${message}`;

}