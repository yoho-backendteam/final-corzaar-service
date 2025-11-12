import mongoose from "mongoose";

const notificationPreferenceSchema = new mongoose.Schema(
  {
    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Institute", 
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    smsNotifications: {
      type: Boolean,
      default: false,
    },
    pushNotifications: {
      type: Boolean,
      default: true,
    },
    preferredLanguage: {
      type: String,
      enum: ["en", "hi", "ta"],
      default: "en",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema
);
