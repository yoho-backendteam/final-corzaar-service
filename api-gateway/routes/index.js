import express from "express";
import dotenv from "@dotenvx/dotenvx"
dotenv.config()
import {createProxyMiddleware} from "http-proxy-middleware"
import { AuthVerify } from "../middelware/AuthVerify.js";
import http from "https"

const routes = express.Router()

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 50,
  maxFreeSockets: 20,
  rejectUnauthorized:false,
});

routes.use("/auth",createProxyMiddleware({
    target:process.env.auth_url,
    changeOrigin:true,
    agent,
    secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/merchant",AuthVerify,createProxyMiddleware({
    target:process.env.merchant_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/student",AuthVerify,createProxyMiddleware({
    target:process.env.student_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/course",AuthVerify,createProxyMiddleware({
    target:process.env.course_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/payment",AuthVerify,createProxyMiddleware({
    target:process.env.payment_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/logs",
    AuthVerify,
    createProxyMiddleware({
    target:process.env.activity_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/other",AuthVerify,createProxyMiddleware({
    target:process.env.other_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/notification",createProxyMiddleware({
    target:process.env.notification_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/content",createProxyMiddleware({
    target:process.env.content_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/reviews",createProxyMiddleware({
    target:process.env.reviews_url,
    changeOrigin:true,
    agent,
    secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/reports",AuthVerify,createProxyMiddleware({
    target:process.env.reports_url,
    changeOrigin:true,
    agent,
    secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))


routes.use("/open/course",(req,res,next)=>{
     req.headers["user"] = JSON.stringify({role:"open"})
     next()
},createProxyMiddleware({
    target:process.env.course_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/open/merchant",(req,res,next)=>{
     req.headers["user"] = JSON.stringify({role:"open"})
     next()
},createProxyMiddleware({
    target:process.env.merchant_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))

routes.use("/open/other",(req,res,next)=>{
     req.headers["user"] = JSON.stringify({role:"open"})
     next()
},createProxyMiddleware({
    target:process.env.other_url,
    changeOrigin:true,
     agent,
     secure:true,
    proxyTimeout:10000,
    timeout:10000,
}))


export default routes