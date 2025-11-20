import { JWTDecoded } from "../utils/AuthHelpers.js";
import axios from "axios"
import dotenv from "@dotenvx/dotenvx"
dotenv.config()

export const AuthVerify=async(req,res,next)=>{
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
                
                if (decoded.role === "noob") {
                    const response = await axios.get(`${process.env.auth_url}/api/users/profile-gate/${decoded._id}`)
                    const {user} = response.data
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
        
                    req.headers["user"] = JSON.stringify(user)
                    next()
                }else if (decoded.role === "student"){
                    const response = await axios.get(`${process.env.auth_url}/api/users/profile-gate/${decoded._id}`)
                    const {user} = response.data
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
        
                    req.headers["user"] = JSON.stringify(user)
                    next()
                }else if (decoded.role === "merchant") {
                    const response = await axios.get(`${process.env.auth_url}/api/merchant/profile-gate/${decoded._id}`)
                    const {user} = response.data
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
        
                    req.headers["user"] = JSON.stringify(user)
                    next()
                }else if(decoded.role === "admin"){
                    const response = await axios.get(`${process.env.auth_url}/api/admin/profile-gate/${decoded._id}`).catch((err)=>{console.log(err)})
                    const {user} = response.data
                    if (!user) {
                        return res.status(401).json({
                            success:false,
                            status: "failed",
                            message: "User not found.",
                            details: "The requested user does not exist in the system."
                        });
                    }
                    req.headers["user"] = JSON.stringify(user)
                    next()
                }else{
                    return res.status(401).json({ message: "your not allow to access", status: "not_permitted" });
                }
        
    } catch (error) {
        res.status(500).json({ status: "failed", message: error.message, data: null });
    }
}