import {
  createInstituteReviewValidation,
  updateInstituteReviewValidation,
} from "../../validations/institutereviewjoi/institutejoi.js";

export const validateCreateInstituteReview = (req, res, next) => {
  const { error } = createInstituteReviewValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};

export const validateUpdateInstituteReview = (req, res, next) => {
  const { error } = updateInstituteReviewValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.details.map((err) => err.message),
    });
  }

  next();
};
