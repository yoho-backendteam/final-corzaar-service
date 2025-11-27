import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  searchCourses,
  getCategories,
  getFeaturedCourses,
  getTrendingCourses,
  getallcorses,
  getCourseByInstitute,
  getCourseByBranch,
  filterCourses,
  GetCartCourseData
} from "../controllers/courseController.js";
import contentRoutes from "../routes/coursecontent/routes.js"; 
import reviewRoutes from "../routes/coursereview/routes.js";
import { authorize } from "../middelwares/authorizationClient.js";
import { PermissionVerify } from "../middelwares/index.js";
import route from "../../../merchant-service/institute/routes/routes.js";



const router = express.Router();

router.get("/filter", PermissionVerify(["open","merchant","admin"]), filterCourses);
router.get("/search",PermissionVerify(["open","merchant","admin"]), searchCourses);
router.get("/categories",PermissionVerify(["open","merchant","admin"]), getCategories);
router.get("/featured",PermissionVerify(["open","merchant","admin"]), getFeaturedCourses);
router.get("/trending",PermissionVerify(["open","merchant","admin"]), getTrendingCourses);

router.get("/",PermissionVerify(["open","merchant","admin"]), getCourses);
router.get("/all",PermissionVerify(["open","merchant","admin"]), getallcorses);
router.post("/",PermissionVerify(["merchant"]), createCourse);
router.get("/getCourseById/:id",PermissionVerify(["open","merchant","admin"]), getCourseById);
router.get("/getCourseBymerchant",PermissionVerify(["merchant","admin"]), getCourseByInstitute);
router.get("/getCourseBybranch/:id",PermissionVerify(["open","merchant","admin"]), getCourseByBranch);
router.put("/:id", 
  PermissionVerify(["merchant"]),
  updateCourse);
router.delete("/:id",
  PermissionVerify(["merchant"]),
   deleteCourse);

router.post("/courseincart",PermissionVerify(["open"]),GetCartCourseData)

router.use("/:id/content", contentRoutes);
router.use("/:id/reviews", reviewRoutes);

export default router;
