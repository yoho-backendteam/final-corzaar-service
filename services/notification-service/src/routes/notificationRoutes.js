import express from "express";
import {
  createNotification,
  getAllNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getNotificationsByType,
  markNotificationAsRead,
  webshow,
} from "../controllers/notificationController.js";
import { authorize } from "../middleware/authorizationClient.js";


const router = express.Router();

router.get("/", getNotificationsByType);
router.post("/", createNotification);
router.get("/all", getAllNotifications);
router.get("/:id", getNotificationById);
router.put("/:id", updateNotification);
router.patch("/:id/read", markNotificationAsRead);
router.delete("/:id",deleteNotification);

router.post("/webshow",webshow);




export default router;
