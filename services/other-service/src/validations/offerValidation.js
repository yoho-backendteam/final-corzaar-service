import Joi from "joi";

export const offerValidation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(""),
  code:Joi.string().required(),
  Offerid:Joi.string().required(),
  discountType: Joi.string().valid("percentage", "flat").required(),
  discountValue: Joi.number().positive().required(),
  validity:Joi.date().required(),
  usage:Joi.number().required(),
  courseId : Joi.string(),
  startDate: Joi.date().required(),
  endDate: Joi.date().greater(Joi.ref("startDate")).required(),
  createdBy: Joi.string().valid("merchant", "admin").required(),
  isActive: Joi.boolean().default(true),
  isDeleted: Joi.boolean().default(false),
  status:Joi.string(),
  publish:Joi.boolean(),
});

export const offerUpdateValidation = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  description: Joi.string().allow("").optional(),
  discountType: Joi.string().valid("percentage", "flat").optional(),
  discountValue: Joi.number().positive().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().greater(Joi.ref("startDate")).optional(),
  createdBy: Joi.string().valid("merchant", "admin").optional(),
  isActive: Joi.boolean().optional(),
}).min(1); 