import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const lessonSchema = new mongoose.Schema({
  lessonId: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  type: { type: String, enum: ["video", "text", "quiz", "assignment"], default: "video" },
  duration: Number,
  content: {
    videoUrl: String,
    textContent: String,
    quizData: Object,
    assignmentData: Object,
  },
  order: Number,
  isPreview: { type: Boolean, default: false },
});

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  description: String,
  order: Number,
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

    instituteId: { type: String ,required:true},
    branchId: {type : mongoose.Schema.ObjectId},
    students: {type: String},
    batches: {type: String},
    duration: {type: String},
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
