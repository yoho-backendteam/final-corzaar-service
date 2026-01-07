import Attendance from "../../models/usersettingModel/AttendanceModel.js";

export const getAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) return res.status(400).json({ success: false, message: "Student ID required" });

    const records = await Attendance.find({ studentId });

    res.status(200).json({
      success: true,
      message: "Attendance fetched successfully",
      data: records.length ? records : [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
