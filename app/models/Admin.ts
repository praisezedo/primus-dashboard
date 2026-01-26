
import  {Schema , models , model} from "mongoose";


const AdminSchema = new Schema({
  schoolId: {
    type: String,
    required: true,
    unique: true,
  },
  adminName: String,
  adminEmail: { type: String, unique: true },
  schoolName: String,
  password: String,

  hasCompletedSetup: {
  type: Boolean,
  default: false,
},
},
{timestamps: true}
);



const Admin = models.Admin || model("Admin" , AdminSchema)

export default Admin;