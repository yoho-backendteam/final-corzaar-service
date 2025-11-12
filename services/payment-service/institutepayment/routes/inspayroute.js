import express from 'express'
import { createPayment, deleteInstitutePayment, getAllInstitutePaymentRequests, getInstitutePaymentByMonth, getInstitutePaymentByMonthwithYear, getInstitutePaymentByYear, getInstitutePaymentRequests, updateInstitutePayment } from '../controllers/paymentControllers.js';

const inspayRoutes = express.Router();

inspayRoutes.post("/",createPayment)
inspayRoutes.get("/getall",getAllInstitutePaymentRequests)
inspayRoutes.get("/month/year",getInstitutePaymentByMonthwithYear)
inspayRoutes.get("/year",getInstitutePaymentByYear)
inspayRoutes.get("/month",getInstitutePaymentByMonth)
inspayRoutes.get("/:instituteId",getInstitutePaymentRequests)
inspayRoutes.put("/:paymentId",updateInstitutePayment)
inspayRoutes.delete("/:paymentId",deleteInstitutePayment)

export default inspayRoutes;