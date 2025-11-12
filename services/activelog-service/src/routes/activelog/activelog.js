import express from "express";
import {
  createActivityLog,
  getAllActivityLogs,
  deleteActivityLog,
  updateActivityLogByUserId,
  getAllActivityByRole,
} from "../../controllers/Activelog/activelog.js";

const router = express.Router();

router.post("/add", createActivityLog);//http://localhost:4000/api/activitylog/add
router.patch("/edit/:userid", updateActivityLogByUserId);//http://localhost:4000/api/activitylog/edit/2
router.delete("/:userid", deleteActivityLog);//http://localhost:4000/api/activitylog/3
router.get("/:userid", getAllActivityLogs);//http://localhost:4000/api/activitylog?userid=3
router.get("/role/:role",getAllActivityByRole)

export default router;
