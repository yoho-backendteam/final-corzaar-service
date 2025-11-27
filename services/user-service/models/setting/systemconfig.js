import mongoose from "mongoose";

const systemConfigSchema = new mongoose.Schema({
  platformName: String,
  platformLogo: String,
  defaultCurrency: String,
  taxRate: Number,
  maintenanceMode: Boolean,
  paymentGateway: {
    razorpayKey: String,
    razorpaySecret: String,
    stripePublishableKey: String,
    stripeSecretKey: String,
  },
  emailServer: {
    smtpHost: String,
    smtpPort: String,
    senderEmail: String,
    smtpPassword: String,
  },
}, { timestamps: true });

const SystemConfig = mongoose.model("SystemConfig", systemConfigSchema);
export default SystemConfig
