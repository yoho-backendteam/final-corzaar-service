import express from "express";
import studentRouter from "./studentmanagement/student_management.js";
import orderRouter from "./studentmanagement/enrollment.js";
import enrollAppRouter from "./studentmanagement/enrollApplication.js";
import cartroute from "./cartnfav/index.js";
import { PermissionVerify } from "../middelwares/index.js";
const routes = express.Router()

routes.use('/student_management', studentRouter);
routes.use("/enrollment",PermissionVerify(["student","noob","merchant","admin"]),orderRouter)
routes.use("/enroll_application",enrollAppRouter)
routes.use("/cart",PermissionVerify(["student","noob"]),cartroute)


export default routes;
