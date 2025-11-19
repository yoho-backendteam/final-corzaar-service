import express from "express";
import { ChangeMerchantPassword, CreateMerchantPassword, GetMerchantProfile, GetMerchantProfileById, MerchantMobileRegister, MerchantRootLogin, UpdateMerchantProfileComplted } from "../../controllers/merchant/index.js";
import { AuthVerify } from "../../middelware/AuthVerify.js";

const merchantRoute = express.Router()

merchantRoute.post("/login",MerchantMobileRegister)
merchantRoute.post("/root-login",MerchantRootLogin)
merchantRoute.get("/profile",AuthVerify(["merchant"]),GetMerchantProfile)
merchantRoute.get('/profile-gate/:id',GetMerchantProfileById)
merchantRoute.put("/change-pass",AuthVerify(["merchant"]),ChangeMerchantPassword)
merchantRoute.put("/create-pass",AuthVerify(["merchant"]),CreateMerchantPassword)

merchantRoute.patch("/iscompleted/:id",UpdateMerchantProfileComplted)


export default merchantRoute