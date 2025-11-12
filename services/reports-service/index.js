import express from "express";
import dotenv from "dotenv"
import route from "./src/routes/index.js";
import connectDB from "./src/config/db.js";
import cors from "cors";

dotenv.config()

const app = express()

const PORT = process.env.reports_service_url || 3011

app.use(express.json())
app.use(cors()) 

app.use("/api",route)
connectDB()
app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.info(`server running on http://localhost:${PORT}`)
})