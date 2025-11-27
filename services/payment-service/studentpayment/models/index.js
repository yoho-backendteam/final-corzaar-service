import mongoose from "mongoose";

const paymentTransactionSchema = new mongoose.Schema(
    {
        transactionId: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            default: () => "TXN-" + Date.now(), // this runs before validation
            match: [/^TXN-\d+$/, "Transaction ID must start with 'TXN-' followed by numbers"],
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        cartId:{
            type:mongoose.Types.ObjectId,
        },
        amount: {
            type: Number,
            required: [true, "Amount is required"],
            min: [1, "Amount must be greater than zero"],
        },

        type: {
            type: String,
            enum: ["Fee", "Refund", "Payout"],
            default: "Fee",
        },

        paymentMethod: {
            type: String,
            enum: ["UPI", "Card", "NetBanking", "Wallet", "Cash"],
            required: [true, "Payment method is required"],
        },

        status: {
            type: String,
            enum: ["Pending", "Completed", "Failed"],
            default: "Pending",
        },
        course:{
            type: String,
        },
        remarks: {
            type: String,
            trim: true,
            maxlength: [200, "Remarks cannot exceed 200 characters"],
        },

        isdeleted: { type: Boolean, default: false },
    },
    { timestamps: true },

);

const PaymentTransaction = mongoose.model("PaymentTransaction", paymentTransactionSchema);
export default PaymentTransaction;