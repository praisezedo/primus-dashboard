import {Schema , model , models} from "mongoose";

const BulkUploadLogSchema = new Schema(
    {
        schoolId: {type: String , required: true},
        sessionId: {type: String , required: true},

        status: {
            type: String,
            enum: ["SUCCESS" , "FAILED"],
            required: true,
        },
        totalRows: Number,
        erorRows: Number,
        errorMessage: String,

        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {timestamps: true}
);

const BulkUploadLog = models.BulkUploadLog || model("BulkUploadLog" , BulkUploadLogSchema);

export default BulkUploadLog;