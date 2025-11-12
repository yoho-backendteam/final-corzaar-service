import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const CartSchema = new mongoose.Schema(
  {
    cartId: { type: String, default: uuidv4, unique:true },
    cartname: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    isdeleted: { type: Boolean, default: false },
    isactive: { type: Boolean, default: true },
    items: [
      {
        courseId: String,
        title: String,
        price: Number,
        discountPrice: Number,
        instituteId: String,
      },
    ],
    pricing: {
      subtotal: { type: Number, default: 0 },
      discount: { type: Number, default: 0 },
      tax: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    coupon: {
      code: { type: String, default: "123" },
      discountAmount: { type: Number, default: 0 },
      discountType: { type: String, enum: ["percentage", "fixed"], default: "fixed" },
    },
    payment: {
      type: new mongoose.Schema(
        {
          method: {
            type: String,
            enum: ["UPI", "Card", "NetBanking", "Wallet", "Cash"],
            required: [true, "Payment method is required"],
          },
          status: {
            type: String,
            enum: ["pending", "completed", "failed", "refunded"],
            default: "pending",
          },
          transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => "TXN-" + Date.now(),
            match: [/^TXN-\d+$/, "Transaction ID must start with 'TXN-' followed by numbers"],
          },
          paymentIntentId: { type: String },
          paidAt: { type: Date, default: Date.now },
          refundedAt: { type: Date,default: Date.now },
          refundAmount: { type: Number, default: 0 },
        },
        { _id: false } // prevents subdocument ID creation
      ),
      required: true, // ✅ ensures `payment` object exists
    },

    billing: {
      firstName: { type: String, default: "" },
      lastName: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: Object, default: {} },
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const CartCourses = mongoose.model('CartCourses', CartSchema)

export default CartCourses
