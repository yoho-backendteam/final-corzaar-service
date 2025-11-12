import {
  createBranchValidation,
  updateBranchValidation,
  idValidation,
  instituteIdValidation,
  uuidValidation
} from "../validation/branchValidation.js";

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

// For query parameters validation
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

export const validateCreateBranch = validateRequest(createBranchValidation);
export const validateUpdateBranch = validateRequest(updateBranchValidation);

export const validateIdParam = validateParams(idValidation);
export const validateInstituteIdParam = validateParams(instituteIdValidation);
export const validateUUIDParam = validateParams(uuidValidation);

export default {
  validateRequest,
  validateParams,
  validateQuery,
  validateCreateBranch,
  validateUpdateBranch,
  validateIdParam,
  validateInstituteIdParam,
  validateUUIDParam
};