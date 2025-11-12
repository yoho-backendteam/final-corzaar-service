import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uuid:{
        type:String,
    },
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
    },
    password:{
        type:String,
    },
    image:{
        type:String,
    },
    role:{
        type:String,
        enum:["admin"],
        default:"admin",
    },
    is_verified:{
        type:Boolean,
        default:false,
    },
    is_pass:{
        type:Boolean,
        default:false,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    isDelete:{
        type:Boolean,
        default:false,
    },
},{
    timestamps:true,
})

export const AdminModel = mongoose.model("AdminModel",userSchema)