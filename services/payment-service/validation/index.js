import Joi from "joi";

export const createPaymentValidation = Joi.object({
  instituteId: Joi.string()
    .required()
    .messages({
      "any.required": "Institute ID is required",
      "string.empty": "Institute ID cannot be empty",
    }),
  studentId: Joi.string()
    .required()
    .messages({
      "any.required": "Student ID is required",
      "string.empty": "Student ID cannot be empty",
    }),

  amount: Joi.number()
    .greater(0)
    .required()
    .messages({
      "number.base": "Amount must be a valid number",
      "number.greater": "Amount must be greater than zero",
      "any.required": "Amount is required",
    }),

  type: Joi.string()
    .valid("Fee", "Refund", "Payout")
    .default("Fee")
    .messages({
      "any.only": "Invalid payment type",
    }),

  paymentMethod: Joi.string()
    .valid("UPI", "Card", "NetBanking", "Wallet", "Cash")
    .required()
    .messages({
      "any.required": "Payment method is required",
      "any.only": "Invalid payment method",
    }),

  status: Joi.string()
    .valid("Pending", "Completed", "Failed")
    .default("Pending"),

  course: Joi.string().allow(""),

  merchantname: Joi.string().allow(""),

  payouts: Joi.object({
    payoutId: Joi.string().allow(""),
    merchant: Joi.string().allow(""),
    totalEarings: Joi.number().allow(null),
    platformfee: Joi.number().allow(null),
    reqDate: Joi.date().allow(null),
    status: Joi.string().valid("Pending", "Processed", "Rejected", "released"),
    pendingbalance: Joi.number().allow(null),
  }).optional(),

  allTransaticon: Joi.object({
    description: Joi.string().allow(""),
    date: Joi.date().allow(null),
    amount: Joi.number().allow(null),
    status: Joi.string().allow(""),
    commision: Joi.number().allow(null),
  }).optional(),

  remarks: Joi.string().max(200).allow("").messages({
    "string.max": "Remarks cannot exceed 200 characters",
  }),

  isdeleted: Joi.boolean().default(false),
});

export const updatePaymentValidation = Joi.object({
  amount: Joi.number().greater(0),
  type: Joi.string().valid("Fee", "Refund", "Commission", "Payout"),
  paymentMethod: Joi.string().valid("UPI", "Card", "NetBanking", "Wallet", "Cash"),
  status: Joi.string().valid("Pending", "Completed", "Failed"),
  remarks: Joi.string().max(200).allow(""),
});
export const createInstitutePaymentManualValidation = Joi.object({
  instituteId: Joi.string().required(),
  month: Joi.string().required(),
  year: Joi.string().required(),
  amount: Joi.string().required(),
  dueDate: Joi.string().required(),
  createdBy: Joi.string().required(),
});