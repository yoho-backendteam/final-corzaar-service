import express from "express";
import {
  createinstitutecontroll,
  getAllInstituteReviews,
  getInstituteReviewById,
  updateInstituteReview,
  deleteInstituteReview,
  getReviewsByInstituteId,
} from "../../controllers/institutereviewcontroll/institutecontroll.js";

import {
  validateCreateInstituteReview,
  validateUpdateInstituteReview,
} from "../../middleware/institutereviewmiddleware/institutemiddleware.js";
import { authorize } from "../../middleware/authorizationClient.js";


const instituteReviewRoute = express.Router();

instituteReviewRoute.post(
  "/create",
  validateCreateInstituteReview,
  createinstitutecontroll
);
instituteReviewRoute.get("/getall", getAllInstituteReviews);
instituteReviewRoute.get("/getbyid/:id", getInstituteReviewById);
instituteReviewRoute.put(
  "/update/:id",
 authorize(["admin","merchant"]),
  updateInstituteReview
);
instituteReviewRoute.delete("/delete/:id",authorize(["admin","merchant"]), deleteInstituteReview);
instituteReviewRoute.get("/institute/:instituteId", getReviewsByInstituteId);

export default instituteReviewRoute;
