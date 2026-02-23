import { sendSMS } from "./index";
import Student from "@/app/models/Students";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function sendBulkSMSInBatches(
  messages: {
    phone: string;
    message: string;
    studentId: string;
  }[],
  batchSize = 20
) {
  for (let i = 0; i < messages.length; i += batchSize) {
    const batch = messages.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (item) => {
        try {
          await sendSMS(item.phone, item.message);

          await Student.updateOne(
            { _id: item.studentId },
            {
              smsStatus: "SENT",
              smsAttempts: 0,
            }
          );
        } catch {
          await Student.updateOne(
            { _id: item.studentId },
            {
              smsStatus: "FAILED",
              $inc: { smsAttempts: 1 },
              lastSmsAttemptAt: new Date(),
            }
          );
        }
      })
    );

    await delay(1000);
  }
}