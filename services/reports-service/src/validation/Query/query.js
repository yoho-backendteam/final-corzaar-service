import Joi from "joi";

export const queryValidationSchema = Joi.object({
    senderid: Joi.string(),

     query: Joi.alternatives().try(
    Joi.string().min(1),
    Joi.array().items(Joi.string().min(1))
  ).required(),

    senderrole: Joi.string().valid("user", "admin", "merchant").required(),
});


export const queryReceiveSchema = Joi.object({
  senderId: Joi.string(),
  senderRole: Joi.string().valid("user", "admin", "merchant")
});


export default {queryValidationSchema,queryReceiveSchema};
