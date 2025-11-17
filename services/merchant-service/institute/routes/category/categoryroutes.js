
import express from "express";
import { createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
 } from "../../../../course-service/src/controllers/coursecategory/categoryController.js";

const categoryroute = express.Router();


categoryroute.post("/", createCategory);
categoryroute.get("/", getCategories);
categoryroute.get("/:uuid", getCategoryById);
categoryroute.put("/:uuid", updateCategory);
categoryroute.delete("/:uuid", deleteCategory);

export default categoryroute;
