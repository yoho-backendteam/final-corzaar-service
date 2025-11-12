import express from "express";
import dotenv from "@dotenvx/dotenvx";
import './src/config/db.config.js'
import routes from "./src/route/routes.js";
import './src/utils/helper.js'
import cors from "cors"
dotenv.config()

const app = express()
app.use(cors())

const PORT = 3006

app.use(express.json())

app.use("/api",routes)

app.use(cors())
app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.info(`server running on http://localhost:${PORT}`)
})