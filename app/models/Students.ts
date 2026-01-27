/**
 * Student document schema and model for managing student records in the SMS automation system.
 * 
 * @schema Student
 * @description Represents a student record linked to a school, session, and their parent contact information.
 * Includes tracking for fees payment status and SMS notification delivery status.
 * 
 * @property {string} schoolId - The unique identifier of the school. Required and indexed for fast lookups.
 * @property {string} sessionId - The academic session identifier. Required.
 * @property {string} studentName - Full name of the student. Required.
 * @property {string} studentId - School-defined unique student identifier. Required. Combined with schoolId for compound uniqueness.
 * @property {string} [className] - The class or grade level of the student.
 * @property {string} [section] - The section or division within the class.
 * @property {string} [parentName] - Name of the student's parent or guardian.
 * @property {string} [parentPhone] - Contact phone number of the parent.
 * @property {string} [parentEmail] - Email address of the parent.
 * @property {"PAID" | "UNPAID"} [feesStatus="UNPAID"] - Current fees payment status of the student.
 * @property {"SENT" | "NOTSENT" | "PENDING"} [smsStatus=null] - Status of the most recent SMS notification.
 * @property {"PAID" | "UNPAID" | "PENDING"} [lastSmsStatus=null] - Status information from the last SMS sent.
 * @property {Date} createdAt - Timestamp of record creation. Auto-generated.
 * @property {Date} updatedAt - Timestamp of last record update. Auto-generated.
 * 
 * @index {schoolId: 1, studentId: 1} - Compound unique index ensuring each student ID is unique per school.
 * @index {schoolId: 1} - Single field index on schoolId for efficient school-based queries.
 */
import { Schema, models, model } from "mongoose";

const StudentSchema = new Schema(
  {
    schoolId: {
      type: String,
      required: true,
      index: true,
    },

    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    studentId: {
      type: String,
      required: true,
      trim: true,
    },

    className: String,
    section: String,

    parentName: String,
    parentPhone: { type: String, trim: true },
    parentEmail: String,

    feesStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: "UNPAID",
    },

    smsStatus: {
      type: String,
      enum: ["SENT", "NOTSENT", "PENDING"],
      default: "NOTSENT",
    },

    lastSmsFeeStatus: {
      type: String,
      enum: ["PAID", "UNPAID"],
      default: null,
    },
  },
  { timestamps: true }
);

// unique studentId per school
StudentSchema.index(
  { schoolId: 1, studentId: 1 },
  { unique: true }
);

const Student = models.Student || model("Student", StudentSchema);
export default Student;


