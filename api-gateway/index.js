import express from "express";
import routes from "./routes/index.js";
import dotenv from "@dotenvx/dotenvx";
import cors from "cors"
import { createProxyMiddleware } from "http-proxy-middleware";
dotenv.config()
const server = express()

// server.use((req, res, next) => {
//   const apiKey = req.headers["x-api-key"];
//   if (apiKey !== "my-secret-key") {
//     return res.status(403).json({ message: "Forbidden" });
//   }
//   next();
// });

server.use(cors())

server.use("/", routes);

server.get("/", (req, res) => {
  res.send("API Gateway is running 🚀");
});


const PORT = 3000

server.listen(PORT,(error)=>{
    if (error) {
       return console.error("api gateway running error:",error)
    }
    console.log("api gateway running at", PORT)
})