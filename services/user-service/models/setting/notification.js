import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  emailNotification: { type: Boolean, default: true },
  smsNotification: { type: Boolean, default: false },
  pushNotification: { type: Boolean, default: false },
  paymentAlert: { type: Boolean, default: true },
  queryAlert: { type: Boolean, default: true },
  offerAlert: { type: Boolean, default: true },
}, { timestamps: true });

const NotificationSettings = mongoose.model("NotificationSettings",notificationSchema);
export default NotificationSettings
