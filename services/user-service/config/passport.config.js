import passport from "passport"
import {Strategy as googleStrategy} from "passport-google-oauth20"
import dotenv from "@dotenvx/dotenvx"
import { UserModel } from "../models/usermodel.js"
import { JWTEncoded } from "../utils/AuthHelpers.js"
dotenv.config()

passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_SECRET_ID,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async(accessToken, refreshToken, profile, done) => {


  const existuser = await UserModel.findOne({OAuth_id:profile?.id})

  if (existuser) {
    const token = await JWTEncoded({email:existuser?.email,_id:existuser?._id,OAuth_id:existuser?.OAuth_id,role:existuser?.role})
    return done(null, token);
  }

  const user = new UserModel({
      first_name:profile.displayName,
      email:profile.emails?.[0]?.value,
      image:profile.photos?.[0]?.value,
      isOAuth:true,
      OAuth_id:profile.id,
      role:"noob"
  })

  await user.save()

  const token = await JWTEncoded({email:user?.email,_id:user?._id,OAuth_id:user?.OAuth_id,role:user?.role})

  done(null, token);
}))

passport.serializeUser((user, done) => {
  done(null, user); 
});

passport.deserializeUser((user, done) => {
  done(null, user);
});