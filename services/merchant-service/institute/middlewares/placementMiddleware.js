import {
  createPlacementValidation,
  updatePlacementValidation,
  uuidValidation,
  instituteIdValidation,
  studentIdValidation,
  placementIdValidation,
  idValidation,
  updateInterviewRoundValidation,
  updateVerificationValidation,
  addDocumentValidation,
  statusFilterValidation,
  companySearchValidation,
  dateRangeValidation,
  addInterviewRoundValidation
} from "../validation/placementValidation.js";

export const validateRequest = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { 
    abortEarly: false, 
    stripUnknown: true 
  });
  
  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((d) => ({ 
        message: d.message, 
        path: d.path 
      })),
    });
  }
  
  req.body = value;
  next();
};

export const validateParams = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.params, { 
    abortEarly: false, 
    stripUnknown: true 
  });
  
  if (error) {
    return res.status(400).json({
      message: "Invalid parameters",
      details: error.details.map((d) => ({ 
        message: d.message, 
        path: d.path 
      })),
    });
  }
  
  req.params = value;
  next();
};

export const validateQuery = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.query, { 
    abortEarly: false, 
    stripUnknown: true 
  });
  
  if (error) {
    return res.status(400).json({
      message: "Invalid query parameters",
      details: error.details.map((d) => ({ 
        message: d.message, 
        path: d.path 
      })),
    });
  }
  
  req.query = value;
  next();
};

export const validateCreatePlacement = validateRequest(createPlacementValidation);
export const validateUpdatePlacement = validateRequest(updatePlacementValidation);
export const validateUpdateInterviewRound = validateRequest(updateInterviewRoundValidation);
export const validateUpdateVerification = validateRequest(updateVerificationValidation);
export const validateAddDocument = validateRequest(addDocumentValidation);
export const validateAddInterviewRound = validateRequest(addInterviewRoundValidation);


export const validateUUIDParam = validateParams(uuidValidation);
export const validateIdParam = validateParams(idValidation);
export const validateInstituteIdParam = validateParams(instituteIdValidation);
export const validateStudentIdParam = validateParams(studentIdValidation);
export const validatePlacementIdParam = validateParams(placementIdValidation);

// Pre-configured query validation middlewares
export const validateStatusFilter = validateQuery(statusFilterValidation);
export const validateCompanySearch = validateQuery(companySearchValidation);
export const validateDateRange = validateQuery(dateRangeValidation);

// Export all validations
export default {
  validateRequest,
  validateParams,
  validateQuery,
  validateCreatePlacement,
  validateUpdatePlacement,
  validateUpdateInterviewRound,
  validateUpdateVerification,
  validateAddDocument,
  validateAddInterviewRound,
  validateUUIDParam,
  validateIdParam,
  validateInstituteIdParam,
  validateStudentIdParam,
  validatePlacementIdParam,
  validateStatusFilter,
  validateCompanySearch,
  validateDateRange
};