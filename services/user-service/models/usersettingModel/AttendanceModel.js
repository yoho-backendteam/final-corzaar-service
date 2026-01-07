import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Types.ObjectId, required: true },
    status: { type: String, enum: ["present", "absent"], required: true },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Attendance", attendanceSchema);
