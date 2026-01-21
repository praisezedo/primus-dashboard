import  { Schema, models, model } from "mongoose";

const SettingSchema = new Schema({
  schoolId: { type: String, unique: true },
  classes: [String],
  sections: [String],
  semester: String,
  profilePic: String,
  academicYear: String,
  smsTemplate: {
    paid: String,
    unpaid: String,
  },
},
  { timestamps: true }
);



const Setting = models.Setting || model("Setting", SettingSchema);
export default Setting;


