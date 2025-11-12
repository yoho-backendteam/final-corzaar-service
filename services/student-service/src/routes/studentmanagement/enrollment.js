import express from "express";
import { createOrderController, getAllOrdersController, getOrderById, } from "../../controllers/studentmanagement/enrollment.js";

const orderRouter = express.Router();

orderRouter.post("/create", createOrderController);
orderRouter.get("/getall",getAllOrdersController);
orderRouter.get("/getbyid/:id",getOrderById)

export default orderRouter;
