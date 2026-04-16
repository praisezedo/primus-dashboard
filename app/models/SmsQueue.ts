import { Schema, models, model } from "mongoose";

const SmsQueueSchema = new Schema(
{
  schoolId: { type: String, index: true },

  studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    index: true
  },

  phone: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["PENDING","SENT","FAILED"],
    default: "PENDING",
  },

  attempts: {
    type: Number,
    default: 0
  },

  lastAttemptAt: Date

},
{ timestamps: true }
);

SmsQueueSchema.index({ status: 1, createdAt: 1 });

export default models.SmsQueue || model("SmsQueue", SmsQueueSchema);