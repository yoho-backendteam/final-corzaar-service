import express from "express";
import dotenv from "@dotenvx/dotenvx"
dotenv.config()
import {createProxyMiddleware} from "http-proxy-middleware"
import { AuthVerify } from "../middelware/AuthVerify.js";

const routes = express.Router()


routes.use("/auth",createProxyMiddleware({
    target:process.env.auth_url,
    changeOrigin:true,
}))

routes.use("/merchant",AuthVerify,createProxyMiddleware({
    target:process.env.merchant_url,
    changeOrigin:true,
}))

routes.use("/student",AuthVerify,createProxyMiddleware({
    target:process.env.student_url,
    changeOrigin:true,
}))

routes.use("/course",AuthVerify,createProxyMiddleware({
    target:process.env.course_url,
    changeOrigin:true,
}))

routes.use("/payment",AuthVerify,createProxyMiddleware({
    target:process.env.payment_url,
    changeOrigin:true,
}))

routes.use("/logs",AuthVerify,createProxyMiddleware({
    target:process.env.activity_url,
    changeOrigin:true,
}))

routes.use("/other",AuthVerify,createProxyMiddleware({
    target:process.env.other_url,
    changeOrigin:true,
}))

routes.use("/notification",createProxyMiddleware({
    target:process.env.notification_url,
    changeOrigin:true,
}))

routes.use("/content",createProxyMiddleware({
    target:process.env.content_url,
    changeOrigin:true,
}))

routes.use("/reviews",createProxyMiddleware({
    target:process.env.reviews_url,
    changeOrigin:true,
}))

routes.use("/reports",createProxyMiddleware({
    target:process.env.reports_url,
    changeOrigin:true
}))


routes.use("/open/course",(req,res,next)=>{
     req.headers["user"] = JSON.stringify({role:"open"})
     next()
},createProxyMiddleware({
    target:process.env.course_url,
    changeOrigin:true,
}))

routes.use("/open/merchant",(req,res,next)=>{
     req.headers["user"] = JSON.stringify({role:"open"})
     next()
},createProxyMiddleware({
    target:process.env.merchant_url,
    changeOrigin:true,
}))

routes.use("/open/other",(req,res,next)=>{
     req.headers["user"] = JSON.stringify({role:"open"})
     next()
},createProxyMiddleware({
    target:process.env.other_url,
    changeOrigin:true,
}))


export default routes