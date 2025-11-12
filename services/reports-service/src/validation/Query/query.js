import Joi from "joi";

export const queryValidationSchema = Joi.object({
    senderid: Joi.string().required(),

     query: Joi.alternatives().try(
    Joi.string().min(1),
    Joi.array().items(Joi.string().min(1))
  ).required(),

    senderrole: Joi.string().valid("User", "Admin", "Merchant").required(),
});


export const queryReceiveSchema = Joi.object({
  senderId: Joi.string().required(),
  senderRole: Joi.string().valid("User", "Admin", "Merchant").required() 
});


export default {queryValidationSchema,queryReceiveSchema};
