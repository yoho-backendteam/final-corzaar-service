import express from "express"
import { ChangeAdminPassword, getProfile, updateProfile } from "../../controllers/settings/profilecontroller.js";
import { updatePassword } from "../../controllers/settings/securitycontroller.js";
import { getNotificationSettings, updateNotificationSettings } from "../../controllers/settings/notificationcontroller.js";
import { createSystemConfig, getSystemConfig, updateSystemConfig } from "../../controllers/settings/systemconfig.js";
const settingRouter = express.Router();

settingRouter.get("/getprofile",getProfile);
settingRouter.put("/updateprofile/:id",updateProfile)
settingRouter.post("/createconfig",createSystemConfig);
settingRouter.get("/getconfig", getSystemConfig);
settingRouter.put("/updateconfig/:id", updateSystemConfig);
settingRouter.get("/getnotify",getNotificationSettings);
settingRouter.put("/updatenotify", updateNotificationSettings);
settingRouter.put("/updatepassword", ChangeAdminPassword);

export default settingRouter;