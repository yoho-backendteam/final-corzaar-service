import Joi from "joi";

const addressSchema = Joi.object({
  street: Joi.string().allow(""),
  city: Joi.string().allow(""),
  state: Joi.string().allow(""),
  country: Joi.string().allow(""),
  zipCode: Joi.string().allow(""),
});

const contactInfoSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9+\-() ]+$/),
  address: addressSchema,
});

const locationSchema = Joi.object({
  type: Joi.string().valid("Point"),
  coordinates: Joi.array().items(Joi.number()).length(2).messages({
    "array.length": "Coordinates must contain [longitude, latitude]",
  }),
});

const documentSchema = Joi.object({
  type: Joi.string(),
  url: Joi.string().uri(),
  uploadedAt: Joi.date(),
  verifiedAt: Joi.date(),
});

export const updateInstituteValidation = Joi.object({
  name: Joi.string().min(3),
  description: Joi.string().allow(""),
  logo: Joi.string().uri().allow(""),
  coverImage: Joi.string().uri().allow(""),
  website: Joi.string().uri().allow(""),
  contactInfo: contactInfoSchema,
  location: locationSchema,
  verification: Joi.object({
    status: Joi.string().valid("pending", "verified", "rejected"),
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
  statistics: Joi.object({
    totalCourses: Joi.number(),
    totalStudents: Joi.number(),
    averageRating: Joi.number(),
    totalReviews: Joi.number(),
    totalRevenue: Joi.number(),
  }),
  settings: Joi.object({
    allowReviews: Joi.boolean(),
    autoApproveInstructors: Joi.boolean(),
    commissionRate: Joi.number().min(0).max(100),
  }),
  adminUsers: Joi.array().items(Joi.string()),
  isActive: Joi.boolean(),
  status: Joi.string().valid("active", "blocked", "suspended"),
});
