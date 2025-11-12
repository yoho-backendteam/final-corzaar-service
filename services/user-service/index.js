import express from "express";
import dotenv from "@dotenvx/dotenvx";
import passport from "passport";
import route from "./routes/index.js";
import "./config/passport.config.js"
import "./config/mongodb.config.js"

dotenv.config()

const service = express()
service.use(express.json())

service.use(passport.initialize())

service.use('/api',route)

service.get('/',(req,res)=>{
    res.send("auth server running...")
})

service.listen(3001,(err)=>{
    if (err) {
        return console.log("service running error:",err)
    }
    console.log("service runing on port 3001")
})