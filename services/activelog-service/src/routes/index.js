import express from "express"
import router from "./activelog/activelog.js"
import DashRoutes from "./dashboard/index.js"
import { PermissionVerify } from "../middelwares/index.js"
const mainRoute = express.Router()

mainRoute.use("/",router)
mainRoute.use("/admindashboard",PermissionVerify(["admin"]),DashRoutes)

export default mainRoute