import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const instituteReviewMapSchema = new mongoose.Schema({
    instituteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Institute",
        required: true,
        unique: true,
    },
    uuid:{
        type: String,
        default:uuidv4,
        unique: true,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "InstituteReview",
        },
    ],
}, { timestamps: true });

export const InstituteReviewMap = mongoose.model(
    "InstituteReviewMap",
    instituteReviewMapSchema
);
