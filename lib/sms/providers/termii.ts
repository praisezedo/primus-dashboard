import axios from "axios";
import { channel } from "diagnostics_channel";

const BASE_URL = process.env.TERMII_BASE_URL;
const API_KEY = process.env.TERMII_API_KEY;
const SENDER_ID = process.env.TERMII_SENDER_ID;

if (!BASE_URL || !API_KEY || !SENDER_ID) {
    throw new Error("Termii environment varialble are missing");
}

export async function  sendViaTermii(to:string , message: string)  {
 try {
    const response = await axios.post(
        `${BASE_URL}/api/sms/send`,
        {
            to,
            from: SENDER_ID,
            sms: message,
            type: 'plain',
            channel: "generic",
            api_key: API_KEY,
        },
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    return response.data;
 }  catch (error: any) {
    console.error(
        "Termii SMS Error:",
        error.response?.data || error.message
    );

    throw new Error("SMS sending failed");
 }
}