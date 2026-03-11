import {Schema , model , models }  from "mongoose";

const PaymentSchema = new Schema (
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

studentId: {
    type: Schema.Types.ObjectId,
    ref: "Student",
    required: true,
}, 

    feeId: {
     type: Schema.Types.ObjectId,
    ref: "StudentFee",
    required: true,
    index: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1,
     },
     method: {
        type: String,
        enum: ["CASH", "CARD", "TRANSFER", "MOBILE_MONEY"],
        default: "CASH",
     }
 },
 {timestamps: true}
);

PaymentSchema.index({ schoolId: 1, sessionId: 1, createdAt: -1 });

export default models.Payment || model("Payment" , PaymentSchema);

