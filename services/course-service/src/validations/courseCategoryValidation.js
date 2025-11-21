import Joi from "joi";

export const createCategorySchema = Joi.object({
  category: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow("").optional(),
  subCategory: Joi.string().required()
});

export const updateCategorySchema = Joi.object({
  category: Joi.string().min(2).max(50).optional(),
  description: Joi.string().allow("").optional(),
  subCategory: Joi.string().optional()
});
