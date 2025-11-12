
import Joi from "joi";

export const favSchema = Joi.object({
  userId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid userId (must be a valid MongoDB ObjectId)"),

  itemId: Joi.string()
    .required()
    .regex(/^[0-9a-fA-F]{24}$/)
    .message("Invalid itemId (must be a valid MongoDB ObjectId)"),
});
