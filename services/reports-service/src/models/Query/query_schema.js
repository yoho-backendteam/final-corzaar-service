import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const querySchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_Register",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin_Register",
      
    },
    senderRole: {
      type: String,
      enum: ["User", "Merchant", "Admin"],
      required: true,
    },
    queries: {
          _id:false,
          senderRole: { type: String, enum: ["User", "Merchant", "Admin"], required: true },
          query: { type: String, required: true },
          response: { type: String, default: "" },
          status: {
            type: String,
            enum: ["incompleted", "completed"],
            default: "incompleted",
          },
          date: { type: Date, default: Date.now },
    },
    uuid: {
      type: String,
      default: uuidv4,
    },
  },
  { timestamps: true }
);

const Query = mongoose.model("Query", querySchema);
export default Query;
