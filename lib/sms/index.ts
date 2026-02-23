import { sendViaTermii } from "./providers/termii";
import { normalizePhone } from "./utils";

export async function sendSMS(phone: string, message: string) {
    const formatted = normalizePhone(phone);

    if (process.env.SMS_PROVIDER === "TERMII") {
        return sendViaTermii(formatted, message);
    }

    throw new Error("SMS provider not configured");
}