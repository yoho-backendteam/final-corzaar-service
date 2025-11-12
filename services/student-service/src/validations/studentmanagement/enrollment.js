import Joi from "joi";

export const createOrderValidation = Joi.object({
  userId: Joi.string().required(),

  items: Joi.array()
    .items(
      Joi.object({
        courseId: Joi.string().required(),
        title: Joi.string().required(),
        price: Joi.number().required(),
        discountPrice: Joi.number().min(0).default(0),
        instituteId: Joi.string().required(),
      })
    )
    .min(1)
    .required(),

  pricing: Joi.object({
    subtotal: Joi.number().required(),
    discount: Joi.number().min(0).default(0),
    tax: Joi.number().min(0).default(0),
    total: Joi.number().required(),
    currency: Joi.string().default("USD"),
  }).required(),

  coupon: Joi.object({
    code: Joi.string().optional(),
    discountAmount: Joi.number().min(0).default(0),
    discountType: Joi.string().valid("percentage", "fixed").optional(),
  }).optional(),

  payment: Joi.object({
    method: Joi.string().required(),
    status: Joi.string()
      .valid("pending", "completed", "failed", "refunded")
      .default("pending"),
    transactionId: Joi.string().optional(),
    paymentIntentId: Joi.string().optional(),
    paidAt: Joi.date().optional(),
    refundedAt: Joi.date().optional(),
    refundAmount: Joi.number().min(0).default(0),
  }).required(),

  billing: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().optional(),
    address: Joi.object().optional(),
  }).required(),

  status: Joi.string()
    .valid("pending", "confirmed", "cancelled")
    .default("pending"),
});
