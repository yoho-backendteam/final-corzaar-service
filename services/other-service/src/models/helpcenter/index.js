import mongoose from "mongoose";

const helpCenterSchema = new mongoose.Schema(
  {
    uuid: { type: String, required: true, unique: true },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["Account", "Payments", "Privacy", "Technical", "General"],
      default: "General",
    },
    content: {
      type: String,
      required: true,
    },
    keywords: [String],
    role: {
      type: String,
      enum: ["student", "institute"],
    required : true
    },
    isdeleted:{type:Boolean,default:false},
    is_active:{type:Boolean,default:true},
  },
  { timestamps: true },
  
);

export default mongoose.model("HelpCenter", helpCenterSchema);
