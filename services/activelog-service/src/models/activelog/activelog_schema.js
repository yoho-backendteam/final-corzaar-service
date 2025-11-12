import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const activityLogSchema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Types.ObjectId,
    },
    actorRole: {
      type: String,
      required: true,
      enum: ["Admin", "Merchant", "User"],
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    uuid: {
      type: String,
      default: uuidv4,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", activityLogSchema);
