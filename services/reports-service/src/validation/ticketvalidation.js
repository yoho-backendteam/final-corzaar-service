import Joi from "joi";

export const ticketValidationSchema = Joi.object({
  instituteId: Joi.string().required().messages({
    "string.empty": "Institute ID is required",
    "any.required": "Institute ID is required",
  }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title should have at least 3 characters",
  }),
  description: Joi.string().min(5).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description should have at least 5 characters",
  }),
  category: Joi.string()
    .valid("Complaint", "Report", "Technical", "Other")
    .required()
    .messages({
      "any.only": "Category must be one of Complaint, Report, Technical, or Other",
      "any.required": "Category is required",
    }),
});

export const studentTicketSchema = Joi.object({
  studentId: Joi.string().required().messages({
    "string.empty": "Student ID is required",
    "any.required": "Student ID is required",
  }),
  title: Joi.string().min(3).max(100).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title should have at least 3 characters",
  }),
  description: Joi.string().min(5).required().messages({
    "string.empty": "Description is required",
    "string.min": "Description should have at least 5 characters",
  }),
  category: Joi.string()
    .valid("Complaint", "Report", "Technical", "Other")
    .required()
    .messages({
      "any.only": "Category must be one of Complaint, Report, Technical, or Other",
      "any.required": "Category is required",
    }),
});
