import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const attendanceSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    batchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
        required: true,
    },
    dateId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DateSchema",
    }
    ],
    uuid: {
        type: String,
        default: uuidv4,
    },
}, { timestamps: true })

export const Attendance = mongoose.model("Attendance", attendanceSchema);