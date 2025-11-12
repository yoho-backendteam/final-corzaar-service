import express from "express";

import { validateCreateCourseReview, validateUpdateCourseReview } from './../../middleware/coursereviewmiddleware/couresmiddleware.js';
import { 
  getAllCourseReviews,
  updateCourseReview,
  deleteCourseReview,
  getReviewsByCourseId,
  createcoursereview,
  getCourseReviewById,
} from "../../controllers/coursereviewcontroll/coursecontroll.js";
import { authorize } from "../../middleware/authorizationClient.js";


const courseReviewRoute = express.Router();
courseReviewRoute.post("/create", validateCreateCourseReview,createcoursereview );
courseReviewRoute.get("/getall", getAllCourseReviews);
courseReviewRoute.get("/getbyid/:id", getCourseReviewById);
courseReviewRoute.put("/update/:id", authorize(["admin","merchant"]), updateCourseReview);
courseReviewRoute.delete("/delete/:id",authorize(["admin","merchant"]), deleteCourseReview);
courseReviewRoute.get("/course/:courseId", getReviewsByCourseId);

export default courseReviewRoute;
