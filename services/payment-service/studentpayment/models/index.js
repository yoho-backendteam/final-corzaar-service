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

        instituteId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Institute",
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true,
        },
        studentName:{
            type:String,
            required:true,
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
        merchantname:{
            type:String,
        },
        payouts:{
            payoutId:{
                type:String,
            },
            merchant:{
                type:String,
            },
            totalEarings:{
                type:Number,
            },
            platformfee:{
                type:Number,
            },
            reqDate:{
                type:Date,
            },
            status:{    
                type:String,
            enum: ["Pending", "Processed", "Rejected","released"],
            },
            pendingbalance:{
                type:Number,
            },
            payoutbalance:{ 
                type:Number,
            }
        },

        allTransaticon:{
       description:{
            type: String,
       },
         date:{     
            type: Date,
         },
         amount:{       
            type: Number,
         },
         status:{       
            type: String,
             enum: ["Pending", "Completed", "Failed"],
         },
         commision:{
            type: Number,
         }
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