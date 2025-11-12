import Joi from "joi";

export const createBatchValidation = Joi.object({
  merchantId: Joi.required(),
  courseId: Joi.required(),
  students:Joi.array().required(),
  batchName: Joi.string().min(3).max(100).required(),
  batchCode: Joi.string().alphanum().min(3).max(20).required(),
  // studentId: Joi.array().items().required(),
  seatsAvailable: Joi.string().required(),
  seatsFilled: Joi.string().required(),
  totalSeats: Joi.string().required(),
  schedule: Joi.object({
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().required(),
    duration: Joi.string().required(),
    classDays: Joi.array()
      .items(
        Joi.string().valid(
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday"
        )
      )
      .min(1)
      .required(),
    classTime: Joi.object({
      start: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required(), // 24-hr format (HH:mm)
      end: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/).required(),
      timezone: Joi.string().default("Asia/Kolkata"),
    }).required(),
  }).required(),
});

export const updateBatchValidation = Joi.object({
  merchantId: Joi.required(),
  courseId: Joi.required(),
  students:Joi.array().required(),
  batchName: Joi.string().min(3).max(100),
  batchCode: Joi.string().alphanum().min(3).max(20),
  studentId: Joi.array().items(),
  seatsAvailable: Joi.string(),
  seatsFilled: Joi.string(),
  totalSeats: Joi.string(),
  schedule: Joi.object({
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    duration: Joi.string(),
    classDays: Joi.array().items(
      Joi.string().valid(
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday"
      )
    ),
    classTime: Joi.object({
      start: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
      end: Joi.string().pattern(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
      timezone: Joi.string(),
    }),
  }),
}).min(1); 

export const updateBatchSettingsValidation = Joi.object({
  settings: Joi.object({
    notificationPreferences: Joi.object({
      email: Joi.boolean(),
      push: Joi.boolean(),
      sms: Joi.boolean()
    }).optional(),
    
    allowEnrollment: Joi.boolean(),
    autoApproveEnrollment: Joi.boolean(),
    allowWithdrawal: Joi.boolean(),
    maxWithdrawalDays: Joi.number().integer().min(0),
    allowCourseExtension: Joi.boolean(),
    extensionMaxDays: Joi.number().integer().min(1)
    
  }).min(1).required() 
});

export const updateBatchContentValidation = Joi.object({
  content: Joi.object({
    totalDuration: Joi.number().integer().positive(),
    totalLessons: Joi.number().integer().min(1),
    totalQuizzes: Joi.number().integer().min(0),
    totalAssignments: Joi.number().integer().min(0),
    modules: Joi.array().items(
      Joi.object({
        moduleId: Joi.string(),
        title: Joi.string(),
        description: Joi.string(),
        order: Joi.number().integer(),
        lessons: Joi.array().items(
          Joi.object({
            lessonId: Joi.string(),
            title: Joi.string(),
            type: Joi.string().valid("video", "text", "quiz"),
            duration: Joi.number().integer(),
            isPreview: Joi.boolean(),
            order: Joi.number().integer(),
            content: Joi.object({
              videoUrl: Joi.string().uri().allow(""),
              textContent: Joi.string().allow(""),
            }),
          })
        ),
      })
    ),
  }).required(),
});
