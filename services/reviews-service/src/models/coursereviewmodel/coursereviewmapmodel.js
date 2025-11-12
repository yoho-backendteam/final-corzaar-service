import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const courseReviewMapSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        unique: true,
    },
    uuid: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseReview",
        },
    ],
}, { timestamps: true });

export const CourseReviewMap = mongoose.model("CourseReviewMap", courseReviewMapSchema);
