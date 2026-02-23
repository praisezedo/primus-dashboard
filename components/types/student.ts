export  type Student = {
  _id: string;
  studentName: string;
  studentId: string;
  className: string;
  section: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  feesStatus: "PAID"| "UNPAID"
  smsStatus?: "SENT" | "NOTSENT" | "PENDING";
}

export type StudentInput = {
    studentName: string,
    studentId: string,
    className: string,
    section: string,
    parentName: string,
    parentPhone: string,
    parentEmail: string,
    feesStatus: string,
}

export type feesStatusProps = {
    studentId: string;
    currentStatus: "PAID"| "UNPAID";
    onUpdated?: () => void;
}


export interface StudentTableProps  {
    students: Student[];
    onDelete: (id: string) => void;
    onRefresh: () => void;
    total?: number;
}

