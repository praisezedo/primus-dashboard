import { Schema, model, models } from "mongoose";

const BulkUploadLogSchema = new Schema(
  {
    schoolId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },

    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true,
    },

    totalRows: { type: Number, required: true },
    insertedRows: { type: Number, default: 0 },

    errorRow: { type: Number }, 
    errorMessage: { type: String },

    notifyParents: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const BulkUploadLog =
  models.BulkUploadLog || model("BulkUploadLog", BulkUploadLogSchema);

export default BulkUploadLog;
