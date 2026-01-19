import mongoose, { Schema, models, model } from "mongoose";

const SettingSchema = new Schema(
  {
    schoolId: {
      type: String,
      required: true,
      unique: true,
    },

    profilePic: String,

    classes: [String],
    sections: [String],

    semester: String,
    academicYear: String,

    smsTemplate: {
      type: String,
      default: "Your child's school fees status has been updated.",
    },
  },
  { timestamps: true }
);

const Setting = models.Setting || model("Setting", SettingSchema);
export default Setting;
