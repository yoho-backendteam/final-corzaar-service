import Joi from 'joi';

export const studentJoiSchema = Joi.object({
  studentId: Joi.string(),
  userId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  admissionDate: Joi.date(),
  status: Joi.string().valid('active', 'inactive', 'graduated', 'dropped', 'suspended'),

  personalInfo: Joi.object({
    firstName:Joi.string(),
    lastName:Joi.string(),
    email:Joi.string().email(),
    fullName:Joi.string(),
    dateOfBirth: Joi.string().required(),
    gender: Joi.string().valid('male', 'female', 'other').required(),
    bloodGroup: Joi.string(),
    nationality: Joi.string(),
    religion: Joi.string(),
    category: Joi.string(),
    address: Joi.object({
      permanent: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
      }).required(),
      current: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zipCode: Joi.string().required(),
        country: Joi.string().required()
      }).required()
    }).required(),
    emergencyContact: Joi.object({
      name: Joi.string().required(),
      relationship: Joi.string().required(),
      phone: Joi.number().required(),
      email: Joi.string().email().required()
    }).required()
  }).required(),

  // academicInfo: Joi.object({
  //   previousEducation: Joi.array().items(
  //     Joi.object({
  //       level: Joi.string().required(),
  //       institution: Joi.string().required(),
  //       board: Joi.string(),
  //       yearOfPassing: Joi.number().integer(),
  //       percentage: Joi.number().min(0).max(100),
  //       subjects: Joi.array().items(Joi.string())
  //     })
  //   ),
  //   currentGPA: Joi.number().min(0).max(10),
  //   totalCredits: Joi.number().default(0),
  //   completedCredits: Joi.number().default(0)
  // }).required(),

  // documents: Joi.array().items(
  //   Joi.object({
  //     type: Joi.string().required(),
  //     name: Joi.string().required(),
  //     url: Joi.string().uri().required(),
  //     uploadedAt: Joi.date()
  //   })
  // ).required()
});


export const studentUpdateJoiSchema = studentJoiSchema.fork(
  Object.keys(studentJoiSchema.describe().keys),
  (schema) => schema.optional()
);