import AfricasTalking from 'africastalking';

const username = process.env.AFRICAN_TALKING_USERNAME!;
const apiKey = process.env.AFRICAN_TALKING_API_KEY!;

const africasTalking = AfricasTalking({
    username,
    apiKey, 
}); 

const sms = africasTalking.SMS;

export async function sendViaAfricaTalking(to: string, message: string) {
    try {
const response = await sms.send({
  to: [to],
  message,
  enqueue: true,
}); 
   console.log("SMS RESPONSE:", JSON.stringify(response, null, 2));
          return response;
    }  catch (error: any) {
        console.error("AfricaTalking SMS Error:", error?.response || error?.message);
         throw new Error("SMS sending failed");
    }
}














































































