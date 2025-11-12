import Joi from "joi";

export const addInstituteFavValidator = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
  instituteId: Joi.string().required().messages({
    "any.required": "Institute ID is required",
  }),
  
});

export const getInstituteFavValidator = Joi.object({
  userId: Joi.string().required().messages({
    "any.required": "User ID is required",
  }),
});
