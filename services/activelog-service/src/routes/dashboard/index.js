import express from "express";
import { getAdminDashboardData } from "../../controllers/admincontroll.js";

const DashRoutes = express.Router();

DashRoutes.get("/get", getAdminDashboardData)

export default DashRoutes;