import SmsQueue from "@/app/models/SmsQueue";
import { sendSMS } from "./index";

function delay(ms:number){
  return new Promise(res=>setTimeout(res,ms));
}

export async function sendBulkSMSInBatches(batchSize=50){

  const queue = await SmsQueue.find({
    status:"PENDING"
  })
  .limit(batchSize);

  for(const sms of queue){

    try{

      await sendSMS(sms.phone,sms.message);

      sms.status="SENT";
      sms.attempts=0;

      await sms.save();

    }catch{

      sms.status="FAILED";
      sms.attempts+=1;
      sms.lastAttemptAt=new Date();

      await sms.save();

    }

  }

  await delay(1000);

}