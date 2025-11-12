import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const safeFetch = async (url, label) => {
  try {
    const res = await axios.get(url);
    return res?.data?.data || res.data || [];
  } catch (err) {
    console.error(`${label} `, {
      message: err.message,
      url,
      code: err.code,
      status: err.response?.status,
      response: err.response?.data,
    });
    return [];
  }
};

export const getAdminDashboardData = async (req, res) => {
  try {
    console.log("Fetching dashboard data...");

    const [
      merchants,
      Spayments,
      courses,
      students,
      notifications,
      placements,
      Ipayments,
      activities,
    ] = await Promise.all([
      safeFetch(process.env.MERCHANT_API, "Merchant API"),
      safeFetch(process.env.PAYMENT_API, "SPayment API"),
      safeFetch(process.env.COURSE_API, "Course API"),
      safeFetch(process.env.STUDENT_API, "Student API"),
      safeFetch(process.env.NOTIFICATION_API, "Notification API"),
      safeFetch(process.env.PLACEMENT_API, "Placement API"),
      safeFetch(process.env.PAYMENTI_API, "IPayment API"),
      safeFetch(process.env.ACTIVITY_API.replace(":role", "Admin"), "Activity API"),
    ]);
    const studentRevenue = Spayments
      ?.filter((p) => p.status?.toLowerCase() === "completed")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const adminCommission = studentRevenue * 0.1;

    const instituteRevenue = Ipayments
      ?.filter((ip) => ip.requestStatus?.toLowerCase() === "success")
      .reduce((sum, ip) => sum + Number(ip.amount || 0), 0);

    const totalRevenue = adminCommission;
    const revenueByDate = {};

    Spayments.filter((p) => p.status?.toLowerCase() === "completed").forEach(
      (p) => {
        const date = new Date(p.createdAt);
        date.setUTCHours(0, 0, 0, 0);
        const dateKey = date.toISOString();

        const adminShare = Number(p.amount || 0) * 0.1;
        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + adminShare;
      }
    );

    const revenueChartData = Object.entries(revenueByDate)
      .map(([date, total]) => ({
        date,
        total,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const totalUsers = students.length;
    const activeMerchants = merchants?.filter((m) => m.isActive).length;
    const activeCourses = courses.length;

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentStudentsCount = students.filter(
      (s) => new Date(s.createdAt) >= oneWeekAgo
    ).length;

    const recentMerchantsCount = merchants.filter(
      (m) => new Date(m.createdAt) >= oneWeekAgo
    ).length;

    const recentTransactions = Spayments
      .filter((p) => p.createdAt)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((p) => ({
        transactionId: p.transactionId || p._id,
        amount: p.amount,
        status: p.status?.toLowerCase() || "pending",
        createdAt: p.createdAt,
        paymentMethod: p.paymentMethod || "Unknown",
        remarks: p.remarks || "",
      }));

    const studentCountsByInstitute = students.reduce((acc, s) => {
      const id = s.instituteId?.toString();
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const courseCountsByInstitute = courses.reduce((acc, c) => {
      const id = c.instituteId?.toString();
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const placementCountsByInstitute = placements.reduce((acc, p) => {
      let id;
      if (typeof p.instituteId === "object" && p.instituteId !== null) {
        id = p.instituteId._id
          ? p.instituteId._id.toString()
          : p.instituteId.toString();
      } else {
        id = p.instituteId?.toString();
      }
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const topMerchants = merchants
      .map((m) => {
        const instituteKey = m.instituteId?.toString() || m._id?.toString();
        return {
          merchantId: m._id,
          name: m.name,
          courseCount: courseCountsByInstitute[instituteKey] || 0,
          userCount: studentCountsByInstitute[instituteKey] || 0,
          placementCount: placementCountsByInstitute[instituteKey] || 0,
          revenue: m.revenue || 0,
        };
      })
      .sort((a, b) => b.userCount - a.userCount)
      .slice(0, 10);

    const recentNotifications = notifications
      .filter((n) => n.type === "admin")
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((n) => ({
        notificationId: n._id,
        title: n.title,
        message: n.message,
        receiverId: n.receiverId,
        isRead: n.isRead,
        createdAt: n.createdAt,
      }));

    const recentActivities = activities
      ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .map((a) => ({
        role: a.role,
        action: a.action,
        message: a.description,
        createdAt: a.createdAt,
      }));

    const dashboardData = {
      totalUsers,
      activeMerchants,
      activeCourses,
      totalRevenue,
      adminCommission,
      studentRevenue,
      instituteRevenue,
      revenueChartData,
      recentRegistrations: {
        students: recentStudentsCount,
        merchants: recentMerchantsCount,
      },
      recentTransactions,
      topMerchants,
      recentNotifications,
      recentActivities,
    };

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};
