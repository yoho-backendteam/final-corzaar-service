import Joi from "joi";

export const createPaymentValidation = Joi.object({
  instituteId: Joi.string().required(),
  studentId: Joi.string().required(),

  studentName: Joi.string()
    .required()
    .messages({
      "any.required": "Student name is required",
    }),

  amount: Joi.number().greater(0).required(),

  type: Joi.string().valid("Fee", "Refund", "Payout").default("Fee"),

  paymentMethod: Joi.string()
    .valid("UPI", "Card", "NetBanking", "Wallet", "Cash")
    .required(),

  status: Joi.string().valid("Pending", "Completed", "Failed").default("Pending"),

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

    payoutbalance: Joi.number().allow(null)   // ⭐ FIXED
  }).optional(),

  allTransaticon: Joi.object({
    description: Joi.string().allow(""),
    date: Joi.date().allow(null),
    amount: Joi.number().allow(null),
    status: Joi.string().allow(""),
    commision: Joi.number().allow(null),
  }).optional(),

  remarks: Joi.string().max(200).allow(""),
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
  dueDate: Joi.date().optional(),
  createdBy: Joi.string().optional(),

  
  requestStatus: Joi.string().valid("Pending", "Success", "Failed").optional(),

  payoutId: Joi.string().optional(),
  merchant: Joi.string().optional(),
  totalEarings: Joi.number().optional(),
  platformfee: Joi.number().optional(),
  reqDate: Joi.date().optional(),
  pendingbalance: Joi.number().optional(),
  payoutbalance: Joi.number().optional(),

  isdeleted: Joi.boolean().optional()
});