import express from "express";
import dotenv from "@dotenvx/dotenvx";
import './src/config/db.config.js'
import routes from "./src/routes/index.js";
dotenv.config()

const app = express()

const PORT = 3010

app.use(express.json())

app.use("/api", routes)


app.listen(PORT, (err) => {
    if (err) {
        return console.error("server running error:", err)
    }
    console.info(`server running on http://localhost:${PORT}`)
})