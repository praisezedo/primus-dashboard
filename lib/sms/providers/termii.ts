

const BASE_URL = process.env.TERMII_BASE_URL;
const API_KEY = process.env.TERMII_API_KEY;
const SENDER_ID = process.env.TERMII_SENDER_ID;

if (!BASE_URL || !API_KEY) {
    throw new Error("Termii BASE_URL and API_KEY environment variables are required");
}

export async function sendViaTermii(phone: string, message: string) {
  try {
    const payload: any = {
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      sms: message,
      type: "plain",
      channel: "generic"
    };

    // Only include sender ID if it's configured
    if (SENDER_ID) {
      payload.from = SENDER_ID;
    }

    const res = await fetch(`${BASE_URL}/api/sms/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[SMS ERROR] Termii API failed:", {
        status: res.status,
        statusText: res.statusText,
        response: data,
        phone,
        timestamp: new Date().toISOString()
      });
      throw new Error(`SMS failed: ${data?.message || res.statusText || "Unknown error"}`);
    }

    console.log("[SMS SUCCESS] Message sent to", phone, data);
    return data;
  } catch (error: any) {
    console.error("[SMS EXCEPTION] Error sending SMS:", {
      error: error?.message,
      phone,
      timestamp: new Date().toISOString()
    });
    throw error;
  }
}