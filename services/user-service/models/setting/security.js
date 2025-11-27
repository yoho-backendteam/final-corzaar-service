import mongoose from "mongoose";

const securitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
  currentPassword: String,
  newPassword: String,
}, { timestamps: true });

const Security = mongoose.model("Security", securitySchema);
export default Security
