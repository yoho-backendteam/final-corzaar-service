import { JWTDecoded } from "../utils/AuthHelpers.js";
import { MerchantModel } from "../models/merchantModel.js";
import { UserModel } from "../models/usermodel.js";


export const AuthVerify=( resource = [])=>async(req,res,next)=>{
    try {
            const token = req.headers['authorization'];
        
                if (!token) {
                    return res.status(500).json({ status: "failed", message: "Authentication credentials not provided" });
                }
        
                const decoded = await JWTDecoded(token)
        
                if (decoded.status === "failed" && decoded.message === "jwt expired") {
                    return res.status(401).json({message: "Your session has expired. Please log in again", status: "session_expired" });
                }
                if (decoded.status === "failed") {
                    return res.status(401).json({message: decoded.message, status: "session_expired"})
                }
                
                if (decoded.role === "noob" && resource.includes(decoded.role)) {
                    const user = await UserModel.findOne({_id:decoded?._id}).select("-password")
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
        
                    req.user = user
                    next()
                }else if (decoded.role === "student" && resource.includes(decoded.role)){
                    const user = await UserModel.findOne({_id:decoded._id}).select("-password")
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
        
                    req.user = user
                    next()
                }else if (decoded.role === "merchant" && resource.includes(decoded.role)) {
                    const user = await MerchantModel.findOne({_id:decoded._id}).select("-password")
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
        
                    req.user = user
                    next()
                }else{
                    return res.status(401).json({ message: "your not allow to access", status: "not_permitted" });
                }
        
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message, data: null });
    }
}