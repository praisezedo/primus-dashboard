import { sendViaTermii } from "./providers/termii";
import { normalizePhone } from "./utils";

export async function sendSMS(phone:string,message:string){

  const formatted = normalizePhone(phone);

  return sendViaTermii(formatted,message);

}