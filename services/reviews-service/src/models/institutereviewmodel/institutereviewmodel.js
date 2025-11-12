import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const instituteReviewSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  instituteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Institute",
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userData",
    required: true,
  },
  studentname: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  commentText: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

export const InstituteReview = mongoose.model(
  "InstituteReview", instituteReviewSchema
);
