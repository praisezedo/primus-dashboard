import { Schema, model, models,  type HydratedDocument } from "mongoose";

interface IStudentFee {
  schoolId: string;
  sessionId: string;
  studentId: Schema.Types.ObjectId;
  className: string;
  feeTypeId: Schema.Types.ObjectId;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: "UNPAID" | "PARTIAL" | "PAID";
}

type StudentFeeDoc = HydratedDocument<IStudentFee>;

const StudentFeeSchema = new Schema<IStudentFee> (
  {
    schoolId: {
      type: String,
      required: true,
    },

    sessionId: {
      type: String,
      required: true,
    },

     studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    className: {
      type: String,
      required: true,
    },

    feeTypeId: {
      type: Schema.Types.ObjectId,
      ref: "FeeType",
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["UNPAID", "PARTIAL", "PAID"],
      default: "UNPAID",
      index: true,
    },
  },
  { timestamps: true }
);



StudentFeeSchema.index(
  { schoolId: 1, sessionId: 1, studentId: 1, feeTypeId: 1 },
  { unique: true }
);

StudentFeeSchema.pre(
  "save",
  { document: true, query: false },
  function (this: StudentFeeDoc) {


    if (this.amountPaid > this.totalAmount) {
      this.amountPaid = this.totalAmount;
    }


    this.balance = this.totalAmount - this.amountPaid;

    if (this.balance < 0) {
      this.balance = 0;
    }


    if (this.amountPaid <= 0) {
      this.status = "UNPAID";
    } else if (this.amountPaid < this.totalAmount) {
      this.status = "PARTIAL";
    } else {
      this.status = "PAID";
    }
  }
);
export default models.StudentFee ||
  model("StudentFee", StudentFeeSchema);