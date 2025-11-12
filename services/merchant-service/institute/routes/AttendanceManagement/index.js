import express from 'express';
import {
    AttendanceCreate,
    GetAllStudentFullAttendance,
    GetAttendanceByDate,
    GetAttendancebyStudentOne,
    UpdateAttendance,
} from '../../controllers/AttendanceManagement/index.js';
import { validateAttendanceMiddleware, validateUpdateAttendanceMiddleware } from '../../middlewares/AttendanceManagement/index.js';
import { BulkAttendanceUpload, upload } from '../../controllers/AttendanceManagement/Bulkupload.js';
// import { sendAbsentNotification } from '../../middelwares/AttendanceManagement/Notificationmiddleware/index.js';

const AttendanceRoute = express.Router();
AttendanceRoute.post(
    '/create',
    validateAttendanceMiddleware,
    // sendAbsentNotification,
    AttendanceCreate
);
AttendanceRoute.put(
    '/update',
    validateUpdateAttendanceMiddleware,
    // sendAbsentNotification,
    UpdateAttendance
);
AttendanceRoute.get('/getbystudent', GetAttendancebyStudentOne);
AttendanceRoute.get('/all-student',GetAllStudentFullAttendance)
AttendanceRoute.get('/bydate', GetAttendanceByDate)
AttendanceRoute.post(
    '/bulk-upload',
    upload.single("file"),
    // sendAbsentNotification,
    BulkAttendanceUpload
);
export default AttendanceRoute;