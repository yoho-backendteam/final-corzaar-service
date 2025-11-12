import express from "express";
import { AdminLogin, AdminRegister, ChangeAdminPassword, GetAdminProfile, GetAdminProfileById } from "../../controllers/admin/index.js";
import { AuthVerify } from "../../middelware/AuthVerify.js";
const adminRoute = express.Router()

adminRoute.post("/login",AdminLogin)
adminRoute.post("/register",AdminRegister)
adminRoute.get('/profile-gate/:id',GetAdminProfileById)
adminRoute.get("/profile",AuthVerify(["admin"]),GetAdminProfile)
adminRoute.put("/change-pass",AuthVerify(["admin"]),ChangeAdminPassword)


export default adminRoute