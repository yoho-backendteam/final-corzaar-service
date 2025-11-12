import express from 'express';
import {
  getFaqs,
  getFaqsByType,
  getFaqsByTypeAndCategory,
  getFaqById,
  updateFaq,
  deleteFaq,
  createFaq,
  getByStatus
} from '../../controllers/faqControllers/faq.js';
import { authorize } from '../../middleware/authorizationClient.js';


const faqRoutes = express.Router();

faqRoutes.post("/", createFaq);
faqRoutes.get("/filter", getFaqsByTypeAndCategory); 
faqRoutes.get("/type", getFaqsByType); 
faqRoutes.get("/status",getByStatus)             
faqRoutes.get("/", getFaqs);                       
faqRoutes.get("/:id", getFaqById);
faqRoutes.put("/:id",
  // authorize(["admin","merchant"]), 
  updateFaq);
faqRoutes.delete("/:id",
  // authorize(["admin","merchant"]), 
deleteFaq);

export default faqRoutes;