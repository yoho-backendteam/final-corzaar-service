import express from "express";
import passport from "passport";
import { GetUserProfile, GetUserProfileById, UsersMobileRegister } from "../../controllers/users/index.js";
import { verifyOtp } from "../../controllers/shared/index.js";
import { AuthVerify } from "../../middelware/AuthVerify.js";

const userRoute = express.Router()

userRoute.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] ,session: false })
);

userRoute.get('/google/callback',
  passport.authenticate('google', { session: false }),
  async(req, res) => {
    res.send(req.user)
  }
);

userRoute.post('/login',UsersMobileRegister)

userRoute.post('/verify-otp',verifyOtp)

userRoute.get('/profile',AuthVerify(["noob","student"]),GetUserProfile)

userRoute.get('/profile-gate/:id',GetUserProfileById)



export default userRoute