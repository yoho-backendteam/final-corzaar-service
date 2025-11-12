import {
  createCourseReviewValidation,
  updateCourseReviewValidation,
} from "../../validations/coursereviewjoi/coursejoi.js";

export const validateCreateCourseReview = (req, res, next) => {
  const { error } = createCourseReviewValidation.validate(req.body, {
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

export const validateUpdateCourseReview = (req, res, next) => {
  const { error } = updateCourseReviewValidation.validate(req.body, {
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
