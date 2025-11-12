import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import "./src/utils/cronJob.js";
import fileRouter from "./src/routes/file.js";
import cors from "cors"



dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


const PORT= 3009;
app.use(express.json());
app.use("/files", fileRouter);




app.listen(PORT,(err)=>{
    if (err) {
        return console.error("server running error:",err)
    }
    console.log(`student server running on http://localhost:${PORT}`)
})

export default app;