
import Joi from "joi";

 const activityLogValidation = Joi.object({
  actorRole: Joi.string().valid("Admin", "Merchant", "User").required(),
  action: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow("", null),
  ipAddress: Joi.string().ip({ version: ["ipv4", "ipv6"] }).allow("", null),
  userAgent: Joi.string().allow("", null),
  metaData: Joi.object().optional(),
});
export default activityLogValidation
