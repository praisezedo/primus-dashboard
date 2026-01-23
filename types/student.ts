export  type Student = {
    StudentName: string;
    StudentID: string;
    Class: string;
    Section: string;
    ParentPhone: string;
    ParentEmail: string;
    FeesStatus: "Paid" | "Unpaid";
    SMSStatus: "Sent" | "Not Sent";
    LastSMSStatus: "Sent" | "Not Sent";
}

