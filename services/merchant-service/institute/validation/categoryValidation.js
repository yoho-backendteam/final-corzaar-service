import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  description: Joi.string().allow("").optional(),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  description: Joi.string().allow("").optional(),
});
