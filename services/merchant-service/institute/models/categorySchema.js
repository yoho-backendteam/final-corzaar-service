import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const categorySchema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
