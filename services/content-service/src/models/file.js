import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  publicId: String, 
  fileType: { type: String, enum: ["image", "video"] },
  fileSize: Number,
  uploadedBy: String,
 createdAt: { type: Date, default: Date.now },
  isDelete: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  deletedAt: { type: Date },
});

export default mongoose.model("File", fileSchema);
