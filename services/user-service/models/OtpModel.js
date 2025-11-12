import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    otp:{
        type:String,
    },
    token:{
        type:String,
    },
    phoneNumber:{
        type:String,
    },
    email:{
        type:String,
    },
    role:{
        type:String,
    },
    expiryDate:{type: Date, default: () => new Date(Date.now() + 5 * 60 * 1000)}
},{
    timestamps:true,
})

OtpSchema.index({expiryDate:1,expireAfterSeconds:0})

export const OtpModel = mongoose.model("OtpModel",OtpSchema)