import express from "express";
import {
  getCourseContent,
  addCourseContent,
  updateCourseContent,
  deleteCourseContent,
} from "../../controllers/coursecontent/controller.js";
import { authorize } from "../../middelwares/authorizationClient.js";
import { PermissionVerify } from "../../middelwares/index.js";

const router = express.Router({ mergeParams: true }); 

router.get("/", getCourseContent);
router.post("/",PermissionVerify(["merchant"]), addCourseContent);
router.put("/:contentId",PermissionVerify(["merchant"]),updateCourseContent);
router.delete("/:contentId",PermissionVerify(["merchant"]), deleteCourseContent);

export default router;
