
import mongoose , {Schema , models , model} from "mongoose";
import {v4 as uuidv4} from "uuid";

const AdminSchema = new Schema(
  {
    schoolId: {
      type: String,
      default: uuidv4, // UNIQUE school identifier
      unique: true,
    },

    adminName: {
      type: String,
      required: true,
    },

    adminEmail: {
      type: String,
      required: true,
      unique: true,
    },

    schoolName: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = models.Admin || model("Admin" , AdminSchema)

export default Admin;