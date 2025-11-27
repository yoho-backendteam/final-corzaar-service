import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  role: { type: String, default: "Admin" },
  fullname: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  image: { type: String },
  lastLogin: { type: String },
  password: { type: String, required: true },
}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);
export default Profile
