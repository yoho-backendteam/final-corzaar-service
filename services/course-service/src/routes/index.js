import express from "express";
import courseRoutes from "./courseRoutes.js";
import courseContentRoutes from "../routes/coursecontent/routes.js";
import reviewRoutes from "../routes/coursereview/routes.js";
import batchRoute from "./batch/batchroute.js";
import courseCategoryRoute from "./category/categoryroutes.js";

const router = express.Router();

router.use("/courses", courseRoutes);

router.use("/:id/content", courseContentRoutes);

router.use("/:id/reviews", reviewRoutes);

router.use("/course", batchRoute);
router.use("/batches", batchRoute);

router.use("/category", courseCategoryRoute)

export default router;
