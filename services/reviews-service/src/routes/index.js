import express from "express";
import InstituteReviewRoute from "./institutereviewroute/index.js";
import courseReviewRoute from "./coursereviewroute/index.js";

const routes = express.Router();

routes.use("/coursereview",courseReviewRoute);
routes.use("/institutereview",InstituteReviewRoute);

export default routes;
