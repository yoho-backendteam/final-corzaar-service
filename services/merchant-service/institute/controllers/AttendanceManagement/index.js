import axios from "axios";
import dotenv from "dotenv";
import { Attendance } from "../../models/AttendanceManagement/Attendance/index.js";
import { DateSchema } from "../../models/AttendanceManagement/DateSchema/index.js";

dotenv.config();

const safeFetch = async (url, label) => {
    try {
        const res = await axios.get(url);
        return res?.data?.data || res.data || [];
    } catch (err) {
        console.error(`${label} Fetch Error`, {
            message: err.message,
            url,
            code: err.code,
            status: err.response?.status,
            response: err.response?.data,
        });
        return null;
    }
};

export const AttendanceCreate = async (req, res) => {
    try {
        const { courseId, batchId, date, attendance } = req.body;

        const batchUrl = process.env.API_BATCH.replace(":courseId", courseId);
        const batch = await safeFetch(`${batchUrl}/${batchId}`, "Batch API");

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const attendanceDate = date ? new Date(date) : new Date();

        if (
            batch.startDate &&
            batch.endDate &&
            (attendanceDate < new Date(batch.startDate) ||
                attendanceDate > new Date(batch.endDate))
        ) {
            return res.status(400).json({
                message: "Attendance date must be within batch start and end date",
            });
        }

        const dateRecord = new DateSchema({
            date: attendanceDate,
            attendance,
        });
        await dateRecord.save();

        let attendanceRecord = await Attendance.findOne({ courseId, batchId });

        if (attendanceRecord) {
            attendanceRecord.dateId.push(dateRecord._id);
            await attendanceRecord.save();
        } else {
            attendanceRecord = new Attendance({
                courseId,
                batchId,
                dateId: [dateRecord._id],
            });
            await attendanceRecord.save();
        }

        res.status(201).json({
            message: "Attendance record created successfully",
            attendance: attendanceRecord,
        });
    } catch (error) {
        console.error("AttendanceCreate Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const GetAttendancebyStudentOne = async (req, res) => {
    try {
        const { courseId, batchId, studentId, month, year } = req.query;
        if (!courseId || !batchId || !studentId || !month || !year) {
            return res.status(400).json({
                message:
                    "courseId, batchId, studentId, month, and year are required",
            });
        }

        const batchUrl = process.env.API_BATCH.replace(":courseId", courseId);
        const batch = await safeFetch(`${batchUrl}/${batchId}`, "Batch API");

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const monthStart = new Date(year, month - 1, 1);
        const monthEnd = new Date(year, month, 0);

        const attendanceRecord = await Attendance.findOne({ courseId, batchId }).populate("dateId");
        if (!attendanceRecord) {
            return res.status(404).json({ message: "No attendance found for this batch" });
        }

        const filteredDates = attendanceRecord.dateId.filter((dateRec) => {
            const dateObj = new Date(dateRec.date);
            return dateObj >= monthStart && dateObj <= monthEnd;
        });

        const studentAttendance = filteredDates.map((record) => {
            const student = record.attendance.find(
                (a) => a.studentId.toString() === studentId
            );
            return {
                date: record.date,
                status: student ? student.status : "Absent",
            };
        });

        const totalPresent = studentAttendance.filter(a => a.status === "Present").length;
        const totalAbsent = studentAttendance.filter(a => a.status === "Absent").length;

        res.status(200).json({
            message: "Student attendance fetched successfully",
            studentId,
            data: studentAttendance,
            totalDays: studentAttendance.length,
            totalPresent,
            totalAbsent,
        });
    } catch (error) {
        console.error("GetAttendancebyStudentOne Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const UpdateAttendance = async (req, res) => {
    try {
        const { courseId, batchId, date, attendance } = req.body;

        if (!courseId || !batchId || !date || !attendance) {
            return res.status(400).json({
                message: "courseId, batchId, date, and attendance are required",
            });
        }

        const batchUrl = process.env.API_BATCH.replace(":courseId", courseId);
        const batch = await safeFetch(`${batchUrl}/${batchId}`, "Batch API");

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const targetDate = new Date(date);

        let attendanceRecord = await Attendance.findOne({ courseId, batchId }).populate("dateId");

        if (!attendanceRecord) {
            return res.status(404).json({
                message: "Attendance record not found for this course and batch",
            });
        }

        let dateRecord = attendanceRecord.dateId.find(
            (d) => new Date(d.date).toDateString() === targetDate.toDateString()
        );

        if (!dateRecord) {
            const newDateRecord = new DateSchema({
                date: targetDate,
                attendance,
            });
            await newDateRecord.save();
            attendanceRecord.dateId.push(newDateRecord._id);
            await attendanceRecord.save();

            return res.status(201).json({
                message: "Date not found — new attendance record created successfully",
                data: newDateRecord,
            });
        }

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

        res.status(200).json({
            message: "Attendance updated successfully",
            data: dateRecord,
        });
    } catch (error) {
        console.error("UpdateAttendance Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const GetAttendanceByDate = async (req, res) => {
    try {
        const { courseId, batchId, date } = req.query;

        if (!courseId || !batchId || !date) {
            return res.status(400).json({
                message: "courseId, batchId, and date are required",
            });
        }

        const batchUrl = process.env.API_BATCH.replace(":courseId", courseId);
        const batch = await safeFetch(`${batchUrl}/${batchId}`, "Batch API");

        if (!batch) {
            return res.status(404).json({ message: "Batch not found" });
        }

        const targetDate = new Date(date);
        if (isNaN(targetDate.getTime())) {
            return res.status(400).json({ message: "Invalid date format" });
        }

        const attendanceRecord = await Attendance.findOne({ courseId, batchId }).populate("dateId");

        if (!attendanceRecord) {
            return res.status(404).json({ message: "No attendance found for this batch" });
        }

        const dateRecord = attendanceRecord.dateId.find(
            (d) => new Date(d.date).toDateString() === targetDate.toDateString()
        );

        if (!dateRecord) {
            return res.status(404).json({ message: "No attendance found for this date" });
        }

        const totalPresent = dateRecord.attendance.filter(a => a.status === "Present").length;
        const totalAbsent = dateRecord.attendance.filter(a => a.status === "Absent").length;

        res.status(200).json({
            message: "Attendance for the date fetched successfully",
            date: dateRecord.date,
            summary: {
                totalPresent,
                totalAbsent,
            },
        });
    } catch (error) {
        console.error("GetAttendanceByDate Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};


export const GetAllStudentFullAttendance = async (req, res) => {
    try {
        const { courseId, batchId } = req.query;
        let allAttendance = [];
        if (courseId && batchId) {
            allAttendance = await Attendance.find({ courseId, batchId }).populate("dateId");
        } else if (courseId) {
            allAttendance = await Attendance.find({ courseId }).populate("dateId");
        } else {
            allAttendance = await Attendance.find({}).populate("dateId");
        }
        if (!allAttendance.length) {
            return res.status(200).json({ message: "No attendance records found" });
        }
        const allStudentsData = await safeFetch(process.env.API_STUDENT, "Student API");

        const studentIdsInAttendance = new Set();
        allAttendance.forEach(att => {
            att.dateId.forEach(d => {
                d.attendance.forEach(a => studentIdsInAttendance.add(a.studentId.toString()));
            });
        });
        const relevantStudents = allStudentsData.filter(s => studentIdsInAttendance.has(s._id));
        const allDates = [];
        allAttendance.forEach(att => {
            att.dateId.forEach(d => {
                const dateStr = new Date(d.date).toDateString();
                if (!allDates.includes(dateStr)) allDates.push(dateStr);
            });
        });
        allDates.sort((a, b) => new Date(a) - new Date(b));
        const attendanceMap = new Map();
        allAttendance.forEach(att => {
            att.dateId.forEach(d => {
                const dateStr = new Date(d.date).toDateString();
                d.attendance.forEach(entry => {
                    attendanceMap.set(`${entry.studentId}-${dateStr}`, entry.status);
                });
            });
        });
        const result = relevantStudents.map(stu => {
            const records = allDates.map(d => ({
                date: d,
                status: attendanceMap.get(`${stu._id}-${d}`) || "Absent"
            }));

            const totalPresent = records.filter(r => r.status === "Present").length;
            const totalAbsent = records.filter(r => r.status === "Absent").length;

            return {
                studentId: stu._id,
                studentName: stu.studentName || stu.name || "Unknown",
                email: stu.email || "",
                totalPresent,
                totalAbsent,
                attendance: records
            };
        });

        res.status(200).json({
            message: "Full attendance of all students fetched successfully",
            totalStudents: result.length,
            dates: allDates,
            data: result
        });

    } catch (error) {
        console.error("GetAllStudentFullAttendance Error:", error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};
