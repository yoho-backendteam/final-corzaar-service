import express from "express";
import courseRoutes from "./courseRoutes.js";
import courseContentRoutes from "../routes/coursecontent/routes.js";
import reviewRoutes from "../routes/coursereview/routes.js";
import batchRoute from "./batch/batchroute.js";

const router = express.Router();

router.use("/courses", courseRoutes);

router.use("/:id/content", courseContentRoutes);

router.use("/:id/reviews", reviewRoutes);

router.use("/course", batchRoute);

export default router;
