export type Settings = {
  classes: string[];
  sections: string[];
  smsTemplate?: {
    paid: string;
    unpaid: string;
  };
};

export  type SmsTemplate = {
    paid: string;
    unpaid: string;
}