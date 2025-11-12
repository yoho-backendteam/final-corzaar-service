import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderId: { type: String, default: uuidv4, unique: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: Array,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
});

export const OrderModel = mongoose.model("Order", orderSchema);