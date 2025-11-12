import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const offerSchema = new mongoose.Schema({
    uuid: {
      type: String,
      required : true,
      default: uuidv4,
      unique: true,
    },
  title: { type: String, required: true },
  description: { type: String },
  code:{ type: String, required: true },
  Offerid:{ type: String, required: true },
  discountType: { type: String, enum: ["percentage", "flat"], required: true },
  discountValue: { type: Number, required: true },
  validity:{ type: Date, required: true },
  usage:{type:Number,required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  courseId : {type : mongoose.Schema.ObjectId,ref : "Course"},
  createdBy: { type: String, default : "merchant", required: true },
  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending"
},
  publish : {
    type : Boolean,
    default : false
  },
   isDeleted: {
      type: Boolean,
      default: false, 
    },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
},
{
  timestamps : true
}
);

export const Offer = mongoose.model("Offer", offerSchema);
