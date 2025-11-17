import express from "express";
import { createOrderController, getAllOrdersController, getOrderById, updateEnrollment, } from "../../controllers/studentmanagement/enrollment.js";

const orderRouter = express.Router();

orderRouter.post("/create", createOrderController);
orderRouter.get("/getall",getAllOrdersController);
orderRouter.get("/getbyid/:id",getOrderById)
orderRouter.put("/update/:id", updateEnrollment)

export default orderRouter;
