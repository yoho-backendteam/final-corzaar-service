import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const studentStatusSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
    },
    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true,
    },
    _id: false,
});

const dateSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    attendance: [studentStatusSchema],
    uuid:{
        type: String,
        default: uuidv4,
    },
}, { timestamps: true });
export const DateSchema = mongoose.model("DateSchema", dateSchema);

