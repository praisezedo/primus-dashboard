

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

      // Extract error message from Termii response
      let errorMessage = res.statusText || "Unknown error";
      if (data?.message) {
        if (Array.isArray(data.message) && data.message.length > 0) {
          const firstError = data.message[0];
          if (typeof firstError === 'object' && firstError !== null) {
            errorMessage = firstError.message || firstError.error || JSON.stringify(firstError);
          } else {
            errorMessage = String(firstError);
          }
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        }
      }

      throw new Error(`SMS failed: ${errorMessage}`);
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