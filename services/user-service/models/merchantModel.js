import mongoose from "mongoose";
import { GetUUID, RandomNumbers } from "../utils/AuthHelpers.js";

const userSchema = new mongoose.Schema({
    uuid:{
        type:String,
    },
    root_id:{
        type:String,
    },
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    image:{
        type:String,
    },
    role:{
        type:String,
        enum:["merchant"],
        default:"merchant",
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

userSchema.pre('save',function(next){
    try {
        if (this.uuid) {
            const id = GetUUID()
            const date = new Date()
            const idstr = "IM" + '-' + date.getFullYear() + '-' + RandomNumbers()
            this.root_id = idstr
            this.uuid = id
            next()
        }else{
            next()
        }
    } catch (error) {
        throw error
    }
})

export const MerchantModel = mongoose.model("MerchantModel",userSchema)