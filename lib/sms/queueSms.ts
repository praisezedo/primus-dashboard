import SmsQueue from "@/app/models/SmsQueue";

export async function queueSms(messages:any[]){

  if(messages.length===0) return;

  await SmsQueue.insertMany(messages);

}