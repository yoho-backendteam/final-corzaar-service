import mongoose from "mongoose";

const instituteFavSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
   
        instituteId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Institute",
          required: true,
        },
      
    
    isactive: { type: Boolean, default: true },
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const InstituteFavorites = mongoose.model("InstituteFavorites", instituteFavSchema);
export default InstituteFavorites;
