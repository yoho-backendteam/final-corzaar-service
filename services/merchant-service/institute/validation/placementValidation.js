import Joi from "joi";

const placementDocumentSchema = Joi.object({
  type: Joi.string().valid("offer_letter", "joining_letter", "contract", "certificate", "other").required(),
  url: Joi.string().uri().required(),
  uploadedAt: Joi.date().optional(),
  verifiedAt: Joi.date().optional(),
});

const salarySchema = Joi.object({
  baseSalary: Joi.number().positive().required(),
  currency: Joi.string().default("USD"),
  bonus: Joi.number().min(0).default(0),
  benefits: Joi.array().items(Joi.string()),
  salaryType: Joi.string().valid("annual", "monthly", "hourly").default("annual"),
});

const companySchema = Joi.object({
  name: Joi.string().required(),
  website: Joi.string().uri().allow(""),
  industry: Joi.string().allow(""),
  size: Joi.string().valid("startup", "small", "medium", "large", "enterprise").allow(""),
  location: Joi.object({
    city: Joi.string().allow(""),
    state: Joi.string().allow(""),
    country: Joi.string().allow(""),
  }),
  description: Joi.string().allow(""),
});

const studentSchema = Joi.object({
  studentId: Joi.string().required(),
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().allow(""),
  course: Joi.string().required(),
  batch: Joi.string().required(),
  department: Joi.string().allow(""),
});

const interviewRoundSchema = Joi.object({
  roundNumber: Joi.number().integer().min(1).required(),
  roundType: Joi.string().valid(
    "online_test", "technical", "hr", "managerial", "group_discussion", "presentation"
  ).required(),
  date: Joi.date().allow(null),
  status: Joi.string().valid("scheduled", "completed", "cancelled").default("scheduled"),
  result: Joi.string().valid("passed", "failed", "waiting").default("waiting"),
  interviewer: Joi.string().allow(""),
  feedback: Joi.string().allow(""),
});

const interviewProcessSchema = Joi.object({
  rounds: Joi.array().items(interviewRoundSchema),
  totalRounds: Joi.number().integer().min(0).default(0),
  completedRounds: Joi.number().integer().min(0).default(0),
});

const placementVerificationSchema = Joi.object({
  status: Joi.string().valid("pending", "verified", "rejected").default("pending"),
  verifiedBy: Joi.string().allow(""),
  verifiedAt: Joi.date().allow(null),
  rejectionReason: Joi.string().allow(""),
  documents: Joi.array().items(placementDocumentSchema).default([]),
});

// Referral Validation
const referralSchema = Joi.object({
  referredBy: Joi.string().allow(""),
  relation: Joi.string().allow(""),
});

// ✅ Create Placement Validation
export const createPlacementValidation = Joi.object({
  instituteId: Joi.string().required(),
  placementId: Joi.string().required(),
  
  student: studentSchema.required(),
  
  company: companySchema.required(),
  
  jobTitle: Joi.string().required(),
  jobDescription: Joi.string().allow(""),
  jobType: Joi.string().valid("full_time", "part_time", "internship", "contract", "freelance").default("full_time"),
  department: Joi.string().allow(""),
  
  salary: salarySchema.required(),
  
  applicationDate: Joi.date().default(Date.now),
  interviewDate: Joi.date().allow(null),
  offerDate: Joi.date().allow(null),
  joiningDate: Joi.date().required(),
  
  interviewProcess: interviewProcessSchema.default({}),
  
  placementStatus: Joi.string().valid(
    "applied", "interviewing", "offer_received", "joined", "rejected", "withdrawn"
  ).default("applied"),
  
  verification: placementVerificationSchema.default({}),
  
  skillsUsed: Joi.array().items(Joi.string()),
  isOnCampus: Joi.boolean().default(true),
  referral: referralSchema.default({}),
  
  isActive: Joi.boolean().default(true),
});

export const uuidValidation = Joi.object({
  uuid: Joi.string().uuid().required()
    .messages({
      'string.uuid': 'Invalid UUID format',
      'any.required': 'UUID is required'
    })
});

export const updatePlacementValidation = Joi.object({
  instituteId: Joi.string().optional(),
  placementId: Joi.string().optional(),
  
  student: studentSchema.optional(),
  
  company: companySchema.optional(),
  
  jobTitle: Joi.string().optional(),
  jobDescription: Joi.string().allow("").optional(),
  jobType: Joi.string().valid("full_time", "part_time", "internship", "contract", "freelance").optional(),
  department: Joi.string().allow("").optional(),
  
  salary: salarySchema.optional(),
  
  applicationDate: Joi.date().optional(),
  interviewDate: Joi.date().allow(null).optional(),
  offerDate: Joi.date().allow(null).optional(),
  joiningDate: Joi.date().optional(),
  
  interviewProcess: interviewProcessSchema.optional(),
  
  placementStatus: Joi.string().valid(
    "applied", "interviewing", "offer_received", "joined", "rejected", "withdrawn"
  ).optional(),
  
  verification: placementVerificationSchema.optional(),
  
  skillsUsed: Joi.array().items(Joi.string()).optional(),
  isOnCampus: Joi.boolean().optional(),
  referral: referralSchema.optional(),
  
  isActive: Joi.boolean().optional(),
  isDeleted: Joi.boolean().optional(),
});

export const idValidation = Joi.object({
  id: Joi.string().required(),
});

export const placementIdValidation = Joi.object({
  placementId: Joi.string().required(),
});

export const instituteIdValidation = Joi.object({
  instituteId: Joi.string().required(),
});

export const studentIdValidation = Joi.object({
  studentId: Joi.string().required(),
});

export const companySearchValidation = Joi.object({
  companyName: Joi.string().required(),
});

export const statusFilterValidation = Joi.object({
  status: Joi.string().valid(
    "applied", "interviewing", "offer_received", "joined", "rejected", "withdrawn", "all"
  ).default("all"),
});

export const dateRangeValidation = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});

export const updateInterviewRoundValidation = Joi.object({
  roundNumber: Joi.number().integer().min(1).required(),
  status: Joi.string().valid("scheduled", "completed", "cancelled").optional(),
  result: Joi.string().valid("passed", "failed", "waiting").optional(),
  interviewer: Joi.string().allow("").optional(),
  feedback: Joi.string().allow("").optional(),
  date: Joi.date().optional(),
});

export const addInterviewRoundValidation = Joi.object({
  roundType: Joi.string().valid(
    "online_test", "technical", "hr", "managerial", "group_discussion", "presentation"
  ).required(),
  date: Joi.date().required(),
  interviewer: Joi.string().allow(""),
});

export const updateVerificationValidation = Joi.object({
  status: Joi.string().valid("pending", "verified", "rejected").required(),
  verifiedBy: Joi.string().when('status', {
    is: 'verified',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
  rejectionReason: Joi.string().when('status', {
    is: 'rejected',
    then: Joi.string().required(),
    otherwise: Joi.string().optional()
  }),
});

export const addDocumentValidation = Joi.object({
  type: Joi.string().valid("offer_letter", "joining_letter", "contract", "certificate", "other").required(),
  url: Joi.string().uri().required(),
});