import express from "express";
import dotenv from "@dotenvx/dotenvx";
import './src/config/db.config.js'
import routes from "./src/routes/index.js";
// import cors from "cors";

dotenv.config()

const app = express()
// app.use(cors()) 

const PORT = process.env.student_service_url || 3003

app.use(express.json())

app.use("/api",routes)

app.get("/",(req,res)=>{
    res.send("student server is running..")
})
app.use(cors());

app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.info(`student server running on http://localhost:${PORT}`)
})