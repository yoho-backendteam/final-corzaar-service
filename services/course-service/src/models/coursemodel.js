import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const lessonSchema = new mongoose.Schema({
  lessonId: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: [true, "Lesson title is required"] },
  type: {
    type: String,
    enum: ["video", "text", "quiz", "assignment"],
    default: "video"
  },
  duration: { type: Number, min: 0 },
  content: {
    videoUrl: { type: String, trim: true },
    textContent: { type: String },
    quizData: { type: Object },
    assignmentData: { type: Object },
  },
  order: { type: Number, min: 0 },
  isPreview: { type: Boolean, default: false },
});

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, default: uuidv4, unique: true },
  title: { type: String, required: [true, "Module title is required"] },
  description: { type: String },
  order: { type: Number, min: 0 },
  lessons: { type: [lessonSchema], default: [] },
});

const courseSchema = new mongoose.Schema(
  {
    uuid: { type: String, unique: true, default: uuidv4 },

    title: { type: String, required: [true, "Course title is required"], trim: true },
    description: { type: String },
    shortDescription: { type: String },
    thumbnail: { type: String },
    previewVideo: { type: String },

    instituteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institute",
      required: true
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },
    category: {
      primary: { type: String },
      secondary: { type: [String], default: [] },
      tags: { type: [String], default: [] },
    },

    pricing: {
      type: {
        type: String,
        enum: ["free", "paid", "subscription"],
        default: "paid",
      },
      price: { type: Number, min: 0 },
      currency: { type: String, default: "INR" },
      discountPrice: { type: Number, min: 0 },
      discountValidUntil: { type: Date },
    },

    content: {
      totalDuration: { type: Number, min: 0 },
      totalLessons: { type: Number, min: 0 },
      totalQuizzes: { type: Number, min: 0 },
      totalAssignments: { type: Number, min: 0 },
      modules: { type: [moduleSchema], default: [] },
    },

    requirements: { type: [String], default: [] },
    learningOutcomes: { type: [String], default: [] },
    targetAudience: { type: [String], default: [] },

    language: { type: String, default: "English" },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },

    reviews: [
      {
        userId: { type: String },
        name: { type: String },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    uuid: {
      type: String,
      unique: true,
      default: uuidv4
    },
    is_active: {
      type: Boolean,
      default: true
    }

  },
  { timestamps: true }
);

export const Course = mongoose.models.Course || mongoose.model("Course", courseSchema);
