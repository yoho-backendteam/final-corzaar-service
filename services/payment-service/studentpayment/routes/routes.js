import express from "express"
import { createPayment, deletepaymentbyid, getallpayementfull, getAllPayments, getByIDPayment, trackPayments,updatePayment } from "../controllers/index.js"
import { createPaymentValidation } from "../../validation/index.js"
import { validate } from "../middleware/validate.js"
import { generateFinancialReport } from "../controllers/report.js"
import { authorize } from "../middleware/authorizationClient.js"
import inspayRoutes from "../../institutepayment/routes/inspayroute.js"

export const route = express.Router()
route.post("/student/:id",validate(createPaymentValidation), createPayment)
route.get('/student/getall/:id',getAllPayments)
route.put('/student/:id',
    authorize(["admin","merchant"]),
    updatePayment)
route.get('/student/:studentId/institute/:instituteId', getByIDPayment);
route.delete("/student/:id",
    authorize(["admin","merchant"]),
    deletepaymentbyid);
route.get('/student/search',trackPayments)
route.get('/student/report',generateFinancialReport)
route.get('/student/all/payments',getallpayementfull)



export default route