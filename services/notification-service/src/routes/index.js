import express from "express";
import { createPreference, deletePreference, getAllPreferences, getPreferenceByMerchant, updatePreference } from "../controllers/notificationpreferencecontrol/precontrolnotifi.js";

const  notifiroute = express.Router();

notifiroute.post("/create", createPreference);
notifiroute.get("/getall", getAllPreferences);
notifiroute.get("/get/:merchantId", getPreferenceByMerchant);
notifiroute.put("/update/:merchantId", updatePreference);
notifiroute.delete("/delete/:merchantId", deletePreference);


export default notifiroute;