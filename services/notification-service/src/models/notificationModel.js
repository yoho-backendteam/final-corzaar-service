import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const notificationSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
    },
    notificationId: {
      type: String,
      unique: true,
      default: function () {
        return `NTF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
    },
    type: {
      type: String,
      enum: ["student", "merchant", "admin"],
      required: [true, "Type is required"],
    },
    receiverId: {
      type: String, 
      required: [true, "Receiver ID is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date, 
    },
    is_deleted:{
      type : Boolean,
      default : false
    },
     is_active:{
      type : Boolean,
      default : true
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

notificationSchema.index(
  { readAt: 1 },
  { expireAfterSeconds: 30 * 24 * 60 * 60 } 
);

export const Notification = mongoose.model("Notification", notificationSchema);
