import dotenv from "dotenv";
dotenv.config();

import axios from "axios";

export const getData = async (url, options = {}) => {
  try {
    const response = await axios.get(url, {
      timeout: 2000,
      ...options,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching:", url, error.message);
    throw error;
  }
};

const merchantHeader = (user) => ({
  headers: {
    user: JSON.stringify({
      _id: user._id,          role: user.role,  
    }),
  },
});

export const getDashboardData = async (req, res) => {
  const user = req.user; 

  try {
    console.log("➡ TEST 1: Calling APIs...");

    const safeCall = async (name, fn) => {
      console.time(name);
      try {
        const data = await fn;
        console.timeEnd(name);
        return data;
      } catch (err) {
        console.timeEnd(name);
        console.error(`❌ ERROR in ${name}:`, err.message);
        return null;
      }
    };
    
    const coursesResponse = await safeCall(
      "courses",
      getData(`${process.env.course_url}/api/courses/getCourseBymerchant`, merchantHeader(user))
    );

    const studentsResponse = await safeCall(
      "students",
      getData(`${process.env.student_url}/api/student_management/getall`, merchantHeader(user))
    );

    const notificationResponse = await safeCall(
      "notifications",
      getData(`${process.env.notification_url}/api?type=merchant`)
    );

    const revenueResponse = await safeCall(
      "revenue",
      getData(`${process.env.payment_url}/api/institute/getall`)
    );

    const recentResponse = await safeCall(
      "enrollments",
      getData(`${process.env.student_url}/api/enrollment/getall`, merchantHeader(user))
    );
    console.log("recenmt",recentResponse,"r enri")

    const batchResponse = await safeCall(
      "batches",
      getData(
        `${process.env.course_url}/api/course/batch/bymerchant/getall`, merchantHeader(user)
      )
    );
     console.log("recenmt",coursesResponse,"rrrrrrrrrrr")
    // ----------- SAFE DATA EXTRACTION -----------
    const courses = coursesResponse|| [];
    const students = studentsResponse?.data || [];
    const notifications = notificationResponse?.data || [];
    const enrollments = recentResponse?.data || [];
    const revenues = revenueResponse?.data || []

    const batches = Array.isArray(batchResponse?.data)
      ? batchResponse.data
      : batchResponse?.data?.data || [];

    // ----------- TRANSFORM DATA -----------
    const activeCourses = courses.filter((course) => course.is_active === true);

    const recentNotifications = [...notifications]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    const recentEnrollments = [...enrollments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((enroll) => ({
        studentName: enroll.billing.firstName || "Unknown",
        // courseName: enroll.items[0].title || "N/A",
        date: enroll.createdAt,
        amount: enroll.pricing.total,
        status: enroll.status || "Pending",
        items: enroll.items || []
      }));

  const topCourses = [...activeCourses]
  .sort((a, b) => (b.enrolledCount || 0) - (a.enrolledCount || 0))
  .slice(0, 5)
  .map((course) => {
    const enrolledCount = course.batch.reduce(
      (sum, i) => sum + i.students.length,
      0
    );

    return {
      title: course.title,
      batches: course.batch.length,
      category: course.category?.primary || "N/A",
      enrolledCount,
      rating: course.rating || "N/A",
      revenue: enrolledCount * (course.pricing?.price || 0),
      instructor: course.instructorName || "Unknown",
      isActive: course.is_active,
    };
  });

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

    // ----------- SEND RESPONSE -----------
    res.status(200).json({
      status: "Success",
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
      revenues,
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
