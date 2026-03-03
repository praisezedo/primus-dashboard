
import { Schema, model, models } from "mongoose";

const ClassFeeConfigSchema = new Schema(
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

    className: {
      type: String,
      required: true,
    },

    feeTypeId: {
      type: Schema.Types.ObjectId,
      ref: "FeeType",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);


ClassFeeConfigSchema.index(
  { schoolId: 1, sessionId: 1, className: 1, feeTypeId: 1 },
  { unique: true }
);

export default models.ClassFeeConfig ||
  model("ClassFeeConfig", ClassFeeConfigSchema);