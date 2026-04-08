import axios from "axios";

const BASE_URL = process.env.TERMII_BASE_URL;
const API_KEY = process.env.TERMII_API_KEY;
const SENDER_ID = process.env.TERMII_SENDER_ID;

if (!BASE_URL || !API_KEY || !SENDER_ID) {
    throw new Error("Termii environment variables are missing");
}

export async function sendViaTermii(phone: string, message: string) {

  const res = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: process.env.TERMII_API_KEY,
      to: phone,
      from: process.env.TERMII_SENDER_ID,
      sms: message,
      type: "plain",
      channel: "generic"
    })
  });

  if (!res.ok) {
    throw new Error("SMS failed");
  }

  return res.json();
}