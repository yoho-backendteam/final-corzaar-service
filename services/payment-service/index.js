import express from "express"
import connectDB from "./config/db.js"
import dotenv from "@dotenvx/dotenvx"
import route from "./studentpayment/routes/routes.js"
import cors from "cors"
import inspayRoutes from './institutepayment/routes/inspayroute.js';

dotenv.config()

const app = express()

const PORT = 3012

app.use(express.json())
app.use(cors())

app.use("/api",route)
app.use("/api/institute",inspayRoutes)
connectDB()
app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.info(`server running on http://localhost:${PORT}`)
})