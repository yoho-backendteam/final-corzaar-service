import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const paymentSchema = new mongoose.Schema({
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  uuid: {
      type: String,
      required : true,
      default: uuidv4,
      unique: true,
    },
  month: { type: String, required: true }, 
  amount: { type: String, required: true },
  year: { type: String, required: true },
  dueDate: {type: Date},
  requestStatus: { 
    type: String, 
    enum: ["Pending", "Success", "Failed"], 
    default: "Pending" 
  },

  
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
            
            pendingbalance:{
                type:Number,
            },
            payoutbalance:{ 
                type:Number,
            },
        
  
  createdBy: { type: String },
  
  createdAt: { type: Date, default: Date.now },
  isdeleted : {
    type : Boolean,
    default: false
  }
},{
  timestamps : true
});

export const InstitutePayment = mongoose.model("InstitutePayment", paymentSchema);
