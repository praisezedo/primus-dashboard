export type SmsTemplate = {
    paid: string;
    unpaid: string;
}

export interface StudentSMSData {
  parentPhone: string;
  parentName: string;
  studentName: string;
  studentId: string;
  className: string;
  section: string;
  feesStatus: string;
  semester?: string;
  schoolName: string;
  smsTemplate: {
    paid: string;
    unpaid: string;
  };
}

export interface TemplateData {
  parentName?: string;
  studentName?: string;
  studentId?: string;
  className?: string;
  section?: string;
  feesStatus?: string;
  semester?: string;
}
