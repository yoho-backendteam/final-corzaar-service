import mongoose from "mongoose";

const favoritesSchema = new mongoose.Schema(
  {
    userid: { type: mongoose.Types.ObjectId, required: true },
    itemId: { type: mongoose.Types.ObjectId, required: true },
    itemType: { type: String, required: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("Favorite", favoritesSchema);
