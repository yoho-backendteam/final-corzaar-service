import express from "express";
import { getCourseReviews, addCourseReview } from "../../controllers/coursereview/controller.js";

const router = express.Router({ mergeParams: true });

router.get("/", getCourseReviews);
router.post("/", addCourseReview);

export default router;
