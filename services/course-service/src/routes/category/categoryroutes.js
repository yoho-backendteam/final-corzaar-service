
import express from "express";
import { createCategory,getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,} from "../../controllers/coursecategory/categoryController.js";

const courseCategoryRoute = express.Router();


courseCategoryRoute.post("/", createCategory);
courseCategoryRoute.get("/", getCategories);
courseCategoryRoute.get("/:uuid", getCategoryById);
courseCategoryRoute.put("/:uuid", updateCategory);
courseCategoryRoute.delete("/:uuid", deleteCategory);

export default courseCategoryRoute;
