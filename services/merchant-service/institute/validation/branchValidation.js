import Joi from "joi";

// Basic schemas
const addressSchema = Joi.object({
  street: Joi.string().allow(""),
  city: Joi.string().allow(""),
  state: Joi.string().allow(""),
  country: Joi.string().allow(""),
  zipCode: Joi.string().allow(""),
});

const contactInfoSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  address: addressSchema,
});

const locationSchema = Joi.object({
  type: Joi.string().valid("Point").required(),
  coordinates: Joi.array().items(Joi.number()).length(2).required(),
});

// Main validations
export const createBranchValidation = Joi.object({
  instituteId: Joi.string().required(),
  branchCode: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  contactInfo: contactInfoSchema.required(),
  location: locationSchema.required(),
  images: Joi.object({
    logo: Joi.string().allow(""),
    coverImage: Joi.string().allow(""),
    gallery: Joi.array().items(Joi.string()),
  }),
  statistics: Joi.object({
    totalStudents: Joi.number().default(0),
    totalCourses: Joi.number().default(0),
    totalClassrooms: Joi.number().default(0),
    totalStaff: Joi.number().default(0),
    averageRating: Joi.number().default(0),
    totalReviews: Joi.number().default(0),
  }),
  settings: Joi.object({
    allowBookings: Joi.boolean().default(true),
    allowOnsitePayments: Joi.boolean().default(true),
    operatingHours: Joi.object({
      open: Joi.string().allow(""),
      close: Joi.string().allow(""),
      timezone: Joi.string().allow(""),
    }),
    isActive: Joi.boolean().default(true),
  }),
  status: Joi.string().valid("active", "inactive", "maintenance", "closed").default("active"),
  isActive: Joi.boolean().default(true),
  establishedDate: Joi.date().allow(null),
  lastMaintenanceDate: Joi.date().allow(null),
});

export const updateBranchValidation = Joi.object({
  instituteId: Joi.string().optional(),
  branchCode: Joi.string().optional(),
  name: Joi.string().optional(),
  description: Joi.string().allow("").optional(),
  contactInfo: contactInfoSchema.optional(),
  location: locationSchema.optional(),
  images: Joi.object().optional(),
  statistics: Joi.object().optional(),
  settings: Joi.object().optional(),
  status: Joi.string().valid("active", "inactive", "maintenance", "closed").optional(),
  isActive: Joi.boolean().optional(),
  establishedDate: Joi.date().allow(null).optional(),
  lastMaintenanceDate: Joi.date().allow(null).optional(),
});

export const idValidation = Joi.object({
  id: Joi.string().required(),
});

export const instituteIdValidation = Joi.object({
  instituteId: Joi.string().required(),
});

export const uuidValidation = Joi.object({
  uuid: Joi.string().uuid().required()
    .messages({
      'string.uuid': 'Invalid UUID format',
      'any.required': 'UUID is required'
    })
});