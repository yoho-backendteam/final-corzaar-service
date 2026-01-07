import Enrollment from "../../../user-service/models/usersettingModel/enrollmentModel.js";

export const getMyCourses = async (req, res) => {
  try {
    const studentId = req.user._id;

    const enrollments = await Enrollment.find({ studentId })
      .populate("courseId");

    const courses = enrollments.map(e => ({
      courseId: e.courseId?._id,
      courseName: e.courseId?.title,
      thumbnail: e.courseId?.thumbnail,
      startDate: e.createdAt,
      status: e.status
    }));

    res.status(200).json({
      status: true,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
