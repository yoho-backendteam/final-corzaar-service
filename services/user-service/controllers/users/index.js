import { generateOtp } from "../../utils/AuthHelpers.js"
import { OtpModel } from "../../models/OtpModel.js"
import { UserModel } from "../../models/usermodel.js"

export const UsersMobileRegister = async(req,res)=>{
    try {
        const {phoneNumber} = req.body

        const existuser = await UserModel.findOne({phoneNumber})

        if (existuser) {
            const {otp,token} = await generateOtp()
            await OtpModel.create({
                otp,
                token,
                phoneNumber:existuser?.phoneNumber,
                role:"student"
            })

            res.status(200).json({status:true,message:"enter your otp",data:{otp,token}})

        }else{
            const user = new UserModel({
                phoneNumber
            })

            await user.save()

            const {otp,token} = await generateOtp()
            await OtpModel.create({
                otp,
                token,
                phoneNumber:user?.phoneNumber,
                role:"student"
            })

            res.status(200).json({status:true,message:"enter your otp",data:{otp,token}})
        }
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const GetUserProfile=async(req,res)=>{
    try {
        const user = req.user

        res.status(200).json({status:true,message:"profile data fetched",data:user})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}

export const GetUserProfileById=async(req,res)=>{
     try {
        const {id} = req.params
        const user = await UserModel.findOne({_id:id}).select("-password")

        res.status(200).json({status:true,message:"profile data fetched",user})
    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}