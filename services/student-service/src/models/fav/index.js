import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Student",
    },
    items: [
      {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        title: String,
        price: Number,
        discountPrice: Number,
        instituteId: { type: mongoose.Schema.Types.ObjectId, ref: "Institute" },
      },
    ],
    isactive: { type: Boolean, default: true },
    isdeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


const FavoriteCourses = mongoose.model("FavoriteCourses",favoriteSchema)
export default FavoriteCourses
