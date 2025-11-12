import express from "express";
import dotenv from "dotenv"
import connectDB from "./institute/config/db.js";
import {route} from "./institute/routes/routes.js";
import dashboardRoutes from "./institute/routes/dashboardRoutes.js"; 
import cors from "cors"


dotenv.config()

const app = express()
app.use(cors())

const PORT =  3002

app.use(express.json())
app.use(cors());

app.use("/api", route );
connectDB()

app.get("/",(req,res)=>{
    res.send("merchant service running...")
})


app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.info(`server running on http://localhost:${PORT}`)
})