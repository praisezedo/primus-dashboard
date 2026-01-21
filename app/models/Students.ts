import mongoose, { Schema, models, model } from "mongoose";

const StudentSchema = new Schema(
  {
    schoolId: {
      type: String,
      required: true,
      index: true,
    },

    studentName: {
      type: String,
      required: true,
    },

    studentId: {
      type: String,
      required: true, // School-defined ID
    },

    class: String,
    section: String,

    parentName: String,
    parentPhone: String,
    parentEmail: String,

    feesStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },

    smsStatus: {
      type: Boolean,
      default: false,
    },

    lastSmsStatus: {
      type: String,
      enum: ["PAID", "UNPAID", "PENDING"],
      default: null,
    },
  },
  { timestamps: true }
);

const Student = models.Student || model("Student", StudentSchema);
export default Student;


