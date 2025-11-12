import express from "express";
import { createEnrollmentApplication } from "../../controllers/studentmanagement/enrollApplication.js";


const enrollAppRouter = express.Router();

enrollAppRouter.post("/sendemail", createEnrollmentApplication);

export default enrollAppRouter;