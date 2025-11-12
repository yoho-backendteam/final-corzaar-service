import express from "express";
import dotenv from "@dotenvx/dotenvx";
import './src/config/db.config.js'
import cors from "cors";
import mainRoute from "./src/routes/index.js";
dotenv.config()

const app = express()

const PORT = process.env.PORT || 3008

app.use(express.json())
app.use(cors()) 

app.use("/api",mainRoute)


app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.info(`student server running on http://localhost:${PORT}`)
})