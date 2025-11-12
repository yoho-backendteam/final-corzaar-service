import { getData } from "../utils/apiHelper.js";
import dotenv from "dotenv"
dotenv.config()
export const getDashboardData = async (req, res) => {
  try {
    const [
      coursesResponse,
      studentsResponse,
      notificationResponse,
      recentResponse,
      batchResponse,
    ] = await Promise.all([
      getData(`${process.env.course_url}/api/courses`),
      getData(`${process.env.merchant_url}/merchant/getall`),
      getData("http://localhost:3005/api?type=merchant"),
      getData("http://localhost:3003/api/enrollment/getall"),
      getData("http://localhost:3004/api/courses/batch/8fc9551b9818562f4a3299c"),
    ]);

    const courses = coursesResponse?.data || [];
    const students = studentsResponse?.data || [];
    const notifications = notificationResponse?.data || [];
    const enrollments = recentResponse?.data || [];

    const batches = Array.isArray(batchResponse?.data)
      ? batchResponse.data
      : batchResponse?.data?.data || [];

    const activeCourses = courses.filter((course) => course.is_active === true);

    const recentNotifications = [...notifications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const recentEnrollments = [...enrollments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((enroll) => ({
        studentName: enroll.studentName || "Unknown",
        courseName: enroll.courseName || "N/A",
        date: enroll.createdAt,
        status: enroll.status || "Pending",
      }));

    const topCourses = [...activeCourses]
      .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
      .slice(0, 5)
      .map((course) => ({
        title: course.title,
        category: course.category?.primary || "N/A",
        enrolledCount: course.enrolledCount || 0,
        rating: course.rating || "N/A",
        instructor: course.instructorName || "Unknown",
        isActive: course.is_active,
      }));

    const totalUsers = students.length;
    const totalCourses = courses.length;
    const totalActiveCourses = activeCourses.length;
    const totalNotifications = notifications.length;
    const totalBatches = batches.length;

    const recentBatches = Array.isArray(batches)
      ? [...batches]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
          .map((batch) => ({
            name: batch.batchName || "Unnamed Batch",
            course: batch.courseId?.title || "N/A",
            startDate: batch.schedule?.startDate || "N/A",
            endDate: batch.schedule?.endDate || "N/A",
            status: batch.status || "Unknown",
          }))
      : [];

    res.status(200).json({
      status : "Success",
      message: "Dashboard data fetched successfully",
      success: true,
      summary: {
        totalUsers,
        totalCourses,
        totalActiveCourses,
        totalNotifications,
        totalBatches,
        recentEnrollments: recentEnrollments.length,
      },
      activeCourses,
      topCourses,
      recentNotifications,
      recentEnrollments,
      recentBatches,
    });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to load dashboard data",
      error: error.message,
    });
  }
};
