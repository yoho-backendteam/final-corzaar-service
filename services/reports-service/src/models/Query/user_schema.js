
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const Admin_Register_Schema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'Student', 'Merchant', "User"]
    },
    permissions: [{ type: String }],
    isActive: { type: Boolean },
    profileImage: { type: String },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    preferences: {
        language: { type: String },
        timezone: { type: String },
        theme: { type: String },
        notifications: {
            email: Boolean,
            push: Boolean,
            sms: Boolean
        }
    }
    ,
    uuid: {
        type: String,
        default: uuidv4,
    },
    otp: { type: String },
    token: { type: String },

}, { timestamps: true })


export default mongoose.model("Admin_Register", Admin_Register_Schema);
