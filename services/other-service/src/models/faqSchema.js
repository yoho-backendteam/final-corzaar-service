import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const faqSchema = new mongoose.Schema({
  uuid : {
    type : String,
    required : true,
    unique : true,
    default : uuidv4
  },
  question: { 
    type: String, 
    required: true 
  },
  answer: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  assignedTo: { 
    type: String, 
    enum: ["merchant", "user"], 
    default: "user" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  isDeleted: {
      type: Boolean,
      default: false, 
    },
  isActive : {
    type : Boolean,
    default : true
  }
},{
    timestamps : true
});

export const Faq = mongoose.model("Faq", faqSchema);