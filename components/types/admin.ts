export type AdminType = {
    adminName: string,
    adminEmail: string,
    schoolName: string,
    adminId: string
    adminPassword: string
}

export  type FormState = {
  adminName: string;
  schoolName: string;
  adminEmail: string;
  adminPassword: string;
};

export  type FormAction = | 
{
  type: "UPDATE_FIELD";
  field: keyof FormState;
  value: string
} | 
 {
    type: "RESET"
 };

