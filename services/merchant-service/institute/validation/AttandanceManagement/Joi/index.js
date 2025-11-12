import Joi from "joi";

export const attendanceSchema = Joi.object({
    courseId: Joi.string().required(),
    batchId: Joi.string().required(),
    date: Joi.date().optional(),
    attendance: Joi.array().items(
        Joi.object({
            studentId: Joi.string().required(),
            status: Joi.string().valid("Present", "Absent", "Late", "Excused").required()
        })
    ).required()
});
export const updateAttendanceSchema = Joi.object({
  courseId: Joi.string().required(),
  batchId: Joi.string().required(),
  date: Joi.date().required(),
  attendance: Joi.array()
    .items(
      Joi.object({
        studentId: Joi.string().required(),
        status: Joi.string()
          .valid("Present", "Absent")
          .required()
      })
    )
    .min(1)
    .required()
});

export const validateAttendance = (data) => {
    return attendanceSchema.validate(data);
};

export const validateAttendanceUpdate = (data) => {
    return updateAttendanceSchema.validate(data);
}


export default {
    validateAttendance,
    validateAttendanceUpdate
};