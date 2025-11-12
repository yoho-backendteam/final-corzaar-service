import Joi from "joi";

// 📍 Validation for address & nested fields
const addressSchema = Joi.object({
  street: Joi.string().allow(""),
  city: Joi.string().allow(""),
  state: Joi.string().allow(""),
  country: Joi.string().allow(""),
  zipCode: Joi.string().allow(""),
});

const contactInfoSchema = Joi.object({
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-() ]+$/).required(),
  address: addressSchema,
});

const locationSchema = Joi.object({
  type: Joi.string().valid("Point").required(),
  coordinates: Joi.array()
    .items(Joi.number())
    .length(2)
    .required()
    .messages({
      "array.length": "Coordinates must contain [longitude, latitude]",
    }),
});

const documentSchema = Joi.object({
  type: Joi.string().required(),
  url: Joi.string().uri().required(),
  uploadedAt: Joi.date().optional(),
  verifiedAt: Joi.date().optional(),
});

// ✅ Main Institute Validation
export const createInstituteValidation = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().allow(""),
  logo: Joi.string().uri().allow(""),
  coverImage: Joi.string().uri().allow(""),
  website: Joi.string().uri().allow(""),
  contactInfo: contactInfoSchema.required(),
  location: locationSchema.required(),
  verification: Joi.object({
    status: Joi.string().valid("pending", "verified", "rejected").default("pending"),
    documents: Joi.array().items(documentSchema),
  }),
  accreditation: Joi.array().items(
    Joi.object({
      body: Joi.string(),
      certificateNumber: Joi.string(),
      validFrom: Joi.date(),
      validTo: Joi.date(),
      document: Joi.string().uri().allow(""),
    })
  ),
  socialMedia: Joi.object({
    facebook: Joi.string().uri().allow(""),
    twitter: Joi.string().uri().allow(""),
    linkedin: Joi.string().uri().allow(""),
    youtube: Joi.string().uri().allow(""),
  }),
  // statistics: Joi.object({
  //   totalCourses: Joi.number(),
  //   totalStudents: Joi.number(),
  //   averageRating: Joi.number(),
  //   totalReviews: Joi.number(),
  //   totalRevenue: Joi.number(),
  // }),
  settings: Joi.object({
    allowReviews: Joi.boolean(),
    autoApproveInstructors: Joi.boolean(),
    commissionRate: Joi.number().min(0).max(100),
  }),
  adminUsers: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
   isdeleted:Joi.boolean(),
  status:Joi.string().valid("active", "blocked", "suspended").required()
});

// ✅ Separate Verification Validation
export const verificationValidation = Joi.object({
  status: Joi.string().valid("pending", "verified", "rejected").required(),
  verifiedBy: Joi.string().when("status", {
    is: "verified",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  rejectionReason: Joi.string().when("status", {
    is: "rejected",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  documents: Joi.array().items(documentSchema),
});
  