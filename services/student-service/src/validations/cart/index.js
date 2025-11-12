import { body, param, query } from "express-validator";
import Joi from "joi";

export const addToCartValidator = Joi.object({
  userId: Joi.string().required(),
  courseId: Joi.string().required(),
  title: Joi.string().required(),
  price: Joi.number().required(),
  discount: Joi.number().optional(),
  instituteId: Joi.string().required(),
  payment: Joi.object({
    method: Joi.string().valid("UPI", "Card", "NetBanking").default("UPI"),
    status: Joi.string().valid("pending", "completed", "failed").default("pending"),
  }).optional(),
  coupon: Joi.object({
    code: Joi.string().optional(),
    discountAmount: Joi.number().optional(),
    discountType: Joi.string().valid("fixed", "percent").default("fixed"),
  }).optional(),
});

export const removeItemValidator = Joi.object({
  userId: Joi.string().required(),
});
export const getCartValidator = Joi.object({
  userId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/),
});

export const applyCouponValidator = [
  body("userId").notEmpty(),
  body("code").notEmpty().withMessage("Coupon code required"),
];
