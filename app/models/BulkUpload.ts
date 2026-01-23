import mongoose from "mongoose";

const BulkUploadSchema = new mongoose.Schema (
    {
        schoolId: {
            type: String,
            require: true,
        },
    sessionId: {
     type: String,
     required: true,
     },
        uploadedBy: String,
        totalRows: Number,
          status: {
            type: String,
            enum: ["success", "failed"]
        },
    },
    {timestamps: true}
)

export default mongoose.models.BulkUpload ||   mongoose.model("BulkUpload", BulkUploadSchema);