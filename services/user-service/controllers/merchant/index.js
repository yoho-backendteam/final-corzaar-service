import { generateOtp } from "../../utils/AuthHelpers.js"
import { MerchantModel } from "../../models/merchantModel.js"
import { OtpModel } from "../../models/OtpModel.js"
import bcrypt from "bcrypt"
import { JWTEncoded } from "../../utils/AuthHelpers.js"
import { GetInstituteByUserId } from "../../utils/axiosHelpers.js"

export const MerchantMobileRegister = async(req,res)=>{
    try {
        const phoneNumber = req.body.identifier

        const existuser = await MerchantModel.findOne({phoneNumber})

        if (existuser) {
            const {otp,token} = await generateOtp()
            await OtpModel.create({
                otp,
                token,
                phoneNumber:existuser?.phoneNumber,
                role:"merchant"
            })

            res.status(200).json({status:true,message:"enter your otp",data:{otp,token}})

        }else{
            const user = new MerchantModel({
                phoneNumber
            })

            await user.save()

            const {otp,token} = await generateOtp()
            await OtpModel.create({
                otp,
                token,
                phoneNumber:user?.phoneNumber,
                role:"merchant"
            })

            res.status(201).json({status:true,message:"enter your otp",data:{otp,token}})
        }
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const GetMerchantProfile=async(req,res)=>{
    try {
        const user = req.user
        const institute = await GetInstituteByUserId(user?._id)
        res.status(200).json({status:true,message:"profile data fetched",data:user,institute:institute?.data})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const GetMerchantProfileById=async(req,res)=>{
    try {
        const {id} = req.params
        const user = await MerchantModel.findOne({_id:id}).select("-password")

        res.status(200).json({status:true,message:"profile data fetched",user})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const MerchantRootLogin = async(req,res)=>{
    try {
        const {rootid,password} = req.body

        const user = await MerchantModel.findOne({root_id:rootid,is_pass:true})

        if (!user) {
            return res.status(404).json({status:false,message:"your root id not exist any merchant"})
        }

        if (!user?.is_pass) {
            return res.status(401).json({status:false,message:"your not created password, login via otp"})
        }

        const verify = bcrypt.compareSync(password,user?.password)

        if (verify) {
            const token = await JWTEncoded({email:user?.email,_id:user?._id,OAuth_id:user?.OAuth_id,role:user?.role,phoneNumber:user?.phoneNumber})
            return res.status(200).json({status:true,message:"login success",data:token})
        }else{
            res.status(400).json({status:false,message:"your enter password doesn't match"})
        }

    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const CreateMerchantPassword=async(req,res)=>{
    try {
        const user = req.user
        const {newPassword,confirmPassword} = req.body

        if (newPassword === confirmPassword) {
            return res.status(200).json({status:false,message:"new and confirm password are not match"})
        }

        const hashpass = bcrypt.hashSync(confirmPassword,13)

        await MerchantModel.findOneAndUpdate({root_id:user?._id},{password:hashpass,is_pass:true})

        res.status(201).json({status:true,message:"password updated successfully"})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const ChangeMerchantPassword = async(req,res)=> {
    try {
        const user = req.user
        const {oldPassword,confirmPassword} = req.body
        
        const existuser = await MerchantModel.findOne({_id:user?._id})

        if (!existuser?.is_pass) {
            return res.status(400).json({status:false,message:"you login via otp. so, not change password."})
        }

        const oldvrify = bcrypt.compareSync(oldPassword,existuser?.password)

        if (!oldvrify) {
            return res.status(400).json({status:false,message:"old password is incorrect"})
        }

        const hashpass = bcrypt.hashSync(confirmPassword,13)

        await MerchantModel.findOneAndUpdate({root_id:user?._id},{password:hashpass})

        res.status(201).json({status:true,message:"password updated successfully"})
    } catch (error) {
        req.status(500).json({status:false,message:error.message})
    }
}

export const UpdateMerchantProfileComplted=async(req,res)=>{
    try {
        const {id} = req.params
        await MerchantModel.updateOne({_id:id},{is_completed:true})

        res.status(200).json({status:true,message:"profile data fetched"})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}