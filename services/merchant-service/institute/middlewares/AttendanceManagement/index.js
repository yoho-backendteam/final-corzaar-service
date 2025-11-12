import { 
    attendanceSchema,
    updateAttendanceSchema,
} from "../../validation/AttandanceManagement/Joi/index.js";

export const validateAttendanceMiddleware = (req, res, next) => {
    const { error } = attendanceSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: error.details[0].message 
        });
    }
    next();
};

export const validateUpdateAttendanceMiddleware = (req, res, next) => {
    const { error } = updateAttendanceSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ 
            message: error.details[0].message 
        }); 
    }
    next();
}
