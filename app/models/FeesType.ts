import {Schema , model , models } from "mongoose";

const FeeTypeSchema = new Schema(
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
    name: {
      type: String,
      required: true,
      trim: true,
    },
     isActive: {
      type: Boolean,
      default: true,
    },
},
{timestamps: true}
);

FeeTypeSchema.index(
  { schoolId: 1, sessionId: 1, name: 1 },
  { unique: true }
);

export default models.FeeType || model("FeeType", FeeTypeSchema);