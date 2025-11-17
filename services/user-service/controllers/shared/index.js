import { AdminModel } from "../../models/adminModel.js"
import { MerchantModel } from "../../models/merchantModel.js"
import { OtpModel } from "../../models/OtpModel.js"
import { UserModel } from "../../models/usermodel.js"
import { JWTEncoded } from "../../utils/AuthHelpers.js"

export const verifyOtp = async (req,res) => {
    try {
        const {otp} = req.body
        const OtpToken = req.body.token

        const otps = await OtpModel.findOne({token:OtpToken})

        if (!otps) {
           return res.status(400).json({status:false,message:"invalied token"})
        }

        if (otp === otps.otp) {
            if (otps.role == "student") {
                const user = await UserModel.findOne({phoneNumber:otps?.phoneNumber})
                const token = await JWTEncoded({email:user?.email,_id:user?._id,OAuth_id:user?.OAuth_id,role:user?.role,phoneNumber:user?.phoneNumber})
                return res.status(200).json({status:true,message:"login success",data:token,reg:user?.is_completed})
            }else if (otps.role == "merchant") {
                const user = await MerchantModel.findOne({phoneNumber:otps?.phoneNumber})
                const token = await JWTEncoded({email:user?.email,_id:user?._id,OAuth_id:user?.OAuth_id,role:user?.role,phoneNumber:user?.phoneNumber})
                return res.status(200).json({status:true,message:"login success",data:token})
            }else if (otps.role == "admin") {
                const user = await AdminModel.findOne({email:otps?.email})
                const token = await JWTEncoded({email:user?.email,_id:user?._id,OAuth_id:user?.OAuth_id,role:user?.role,phoneNumber:user?.phoneNumber})
                return res.status(200).json({status:true,message:"login success",data:token})
            }else{
                return res.status(200).json({status:true,message:"your role as incorrect"})
            }
            
        }else{
            return res.status(400).json({status:false,message:"incorrect otp"})
        }


    } catch (error) {
        res.status(500).json({status:false,message:error.message})
    }
}
