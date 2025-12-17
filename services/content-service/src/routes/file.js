import express from "express";
import multer from "multer";
import { uploadFile, getAllFiles, updateFile, deleteFile, getFileById } from "../controllers/file.js";
const fileRouter = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

fileRouter.post("/uploadfile", upload.single("file"), uploadFile);
fileRouter.get("/getfile", getAllFiles);
fileRouter.get("/getbyid/:id", getFileById)
fileRouter.put("/update/:id",
    upload.single("file"), updateFile);
fileRouter.delete("/delete/:id", deleteFile);

export default fileRouter;
