import Joi from "joi";

export const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow(""),
  shortDescription: Joi.string().optional().allow(""),
  thumbnail: Joi.string().optional().allow(""),
  previewVideo: Joi.string().optional().allow(""),
  category: Joi.object({
    primary: Joi.string().optional().allow(""),
    secondary: Joi.array().items(Joi.string()).optional(),
    tags: Joi.array().items(Joi.string()).optional(),
  }).optional(),
  pricing: Joi.object({
    type: Joi.string().valid("free", "paid", "subscription").optional(),
    price: Joi.number().min(0).optional(),
    currency: Joi.string().optional(),
  }).optional(),
  level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  language: Joi.string().optional().allow(""),
});

export const updateCourseSchema = createCourseSchema.fork(["title"], (schema) => schema.optional());
