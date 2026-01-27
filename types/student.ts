export  type Student = {
    studentName: string;
    studentID: string;
    class: string;
    section: string;
    parentPhone: string;
    parentEmail: string;
    feesStatus: "PAID" | "UNPAID";
    smsStatus: "Sent" | "Not Sent";
    lastSmsStatus: "Sent" | "Not Sent";
}

export type StudentInput = {
    studentName: string,
    studentId: string,
    class: string,
    section: string,
    parentName: string,
    parentPhone: string,
    parentEmail: string,
    feesStatus: string,
}

