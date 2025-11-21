import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const courseCategorySchema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4, unique: true },
    category: { type: String, required: true, trim: true },
    subCategory : { type : String, required: true},
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Category = mongoose.model("courseCategory", courseCategorySchema);
