import Joi from "joi";

export const createNotificationSchema = Joi.object({
  receiverId: Joi.string().required().messages({
    "any.required": "Receiver ID is required",
  }),
  title: Joi.string().required().messages({
    "any.required": "Title is required",
  }),
  message: Joi.string().required().messages({
    "any.required": "Message is required",
  }),
  type: Joi.string()
    .valid("student", "merchant", "admin")
    .required()
    .messages({
      "any.only": "Type must be student, merchant, or admin",
      "any.required": "Type is required",
    }),
  isRead: Joi.boolean().optional(),
});

export const updateNotificationSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  message: Joi.string().min(5).optional(),
  type: Joi.string().valid("student", "merchant", "admin").optional(),
  isRead: Joi.boolean().optional(),
}).min(1); 
