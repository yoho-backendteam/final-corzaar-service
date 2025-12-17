import Joi from "joi";

const activityLogValidation = Joi.object({
  userid: Joi.string()
    .required(),

  actorRole: Joi.string()
    .valid("Admin", "Merchant", "User")
    .required(),

  action: Joi.string()
    .min(3)
    .max(100)
    .required(),

  description: Joi.string()
    .allow("", null)
    .optional(),

  ipAddress: Joi.string()
    .ip({ version: ["ipv4", "ipv6"] })
    .allow("", null)
    .optional(),

  userAgent: Joi.string()
    .allow("", null)
    .optional(),

  metaData: Joi.object().optional(),
})
  .options({ allowUnknown: false });

export default activityLogValidation;
