import { Attendance } from "../../models/AttendanceManagement/Attendance/index.js";
import { DateSchema } from "../../models/AttendanceManagement/DateSchema/index.js";
import multer from "multer";
import xlsx from "xlsx";
import fs from "fs";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
        "text/csv"
    ];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only Excel and CSV files are allowed"), false);
    }
};
export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});
export const BulkAttendanceUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);
        fs.unlinkSync(filePath);
        if (!data || data.length === 0) {
            return res.status(400).json({ message: "File is empty or invalid format" });
        }
        const requiredColumns = ["courseId", "batchId", "date", "studentId", "status"];
        const fileColumns = Object.keys(data[0]);
        const missingColumns = requiredColumns.filter(col => !fileColumns.includes(col));
        if (missingColumns.length > 0) {
            return res.status(400).json({
                message: "Missing required columns",
                missingColumns
            });
        }
        const groupedData = {};
        data.forEach((row) => {
            const key = `${row.courseId}_${row.batchId}_${row.date}`;
            if (!groupedData[key]) {
                groupedData[key] = {
                    courseId: row.courseId,
                    batchId: row.batchId,
                    date: row.date,
                    attendance: []
                };
            }
            const validStatuses = ["Present", "Absent", "Late", "Excused"];
            if (!validStatuses.includes(row.status)) {
                throw new Error(`Invalid status "${row.status}" for student ${row.studentId}`);
            }
            groupedData[key].attendance.push({
                studentId: row.studentId,
                status: row.status
            });
        });
        const results = [];
        const errors = [];
        for (const key in groupedData) {
            const { courseId, batchId, date, attendance } = groupedData[key];
            try {
                const attendanceDate = new Date(date);
                if (isNaN(attendanceDate.getTime())) {
                    errors.push({
                        courseId,
                        batchId,
                        date,
                        error: "Invalid date format"
                    });
                    continue;
                }
                let attendanceRecord = await Attendance.findOne({ courseId, batchId }).populate("dateId");
                if (attendanceRecord) {
                    let dateRecord = attendanceRecord.dateId.find(
                        (d) => new Date(d.date).toDateString() === attendanceDate.toDateString()
                    );
                    if (dateRecord) {
                        attendance.forEach((updateStudent) => {
                            const existingStudent = dateRecord.attendance.find(
                                (a) => a.studentId.toString() === updateStudent.studentId
                            );
                            if (existingStudent) {
                                existingStudent.status = updateStudent.status;
                            } else {
                                dateRecord.attendance.push(updateStudent);
                            }
                        });
                        await dateRecord.save();
                        results.push({
                            courseId,
                            batchId,
                            date,
                            action: "updated",
                            studentsCount: attendance.length
                        });
                    } else {
                        const newDateRecord = new DateSchema({
                            date: attendanceDate,
                            attendance
                        });
                        await newDateRecord.save();
                        attendanceRecord.dateId.push(newDateRecord._id);
                        await attendanceRecord.save();

                        results.push({
                            courseId,
                            batchId,
                            date,
                            action: "created",
                            studentsCount: attendance.length
                        });
                    }
                } else {
                    const dateRecord = new DateSchema({
                        date: attendanceDate,
                        attendance
                    });
                    await dateRecord.save();
                    const newAttendanceRecord = new Attendance({
                        courseId,
                        batchId,
                        dateId: [dateRecord._id]
                    });
                    await newAttendanceRecord.save();
                    results.push({
                        courseId,
                        batchId,
                        date,
                        action: "created",
                        studentsCount: attendance.length
                    });
                }
            } catch (error) {
                errors.push({
                    courseId,
                    batchId,
                    date,
                    error: error.message
                });
            }
        }
        res.status(200).json({
            message: "Bulk attendance upload completed",
            totalRecords: Object.keys(groupedData).length,
            successful: results.length,
            failed: errors.length,
            results,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
export default { BulkAttendanceUpload, upload };