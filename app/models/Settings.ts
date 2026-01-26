import { Schema, models, model } from "mongoose";

const SettingSchema = new Schema({
  schoolId: { type: String, required: true, unique: true },

  classes: { type: [String], default: [] },
  sections: { type: [String], default: [] },

  semester: { type: String, default: "" },

  smsTemplate: {
    paid: { type: String, default: "" },
    unpaid: { type: String, default: "" },
  },
  
  settingsCompleted: {
      type: Boolean,
      default: false,
    },
});


const Setting = models.Setting || model("Setting", SettingSchema);
export default Setting;
