import express from "express"
import { verifyOtp } from "../../controllers/shared/index.js"
const sharedRoute = express.Router()

sharedRoute.post("/verify-otp",verifyOtp)

export default sharedRoute