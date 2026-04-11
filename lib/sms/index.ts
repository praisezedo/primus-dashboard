import { normalizePhone } from "./utils";
import { sendViaAfricaTalking } from "./providers/africastalking";
//import { sendViaTermii } from "./providers/termii";

export async function sendSMS(phone: string, message: string) {
  const formatted = normalizePhone(phone);

 if (process.env.SMS_PROVIDER === "AFRICAS_TALKING") {
    return sendViaAfricaTalking(formatted, message);
  }

 /* if (process.env.SMS_PROVIDER === "TERMII") {
    return sendViaTermii(formatted, message);
  } */

  throw new Error("SMS provider not configured");
}