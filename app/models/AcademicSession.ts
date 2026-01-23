import mongoose , {Schema} from "mongoose";
import {v4 as uuid} from "uuid";

const AcademicSessionSchema = new Schema(
    {
    sessionId: {
            type: String,
            default: uuid,
            unique: true
        },
      schoolId: {
      type: String,
      required: true,
    },
    name: {
      type: String, // e.g. "2024/2025"
      required: true,
    }, 
   isActive: {
      type: Boolean,
      default: false,
    },
    },
    {timestamps: true}
);

export default mongoose.models.AcademicSession ||   mongoose.model("AcademicSession", AcademicSessionSchema);