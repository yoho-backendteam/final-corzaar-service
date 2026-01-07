import Attendance from "../../../user-service/models/usersettingModel/AttendanceModel.js";
import Payment from "../../../user-service/models/usersettingModel/PaymentModel.js";
import Favorite from "../../../user-service/models/usersettingModel/FavouriteModel.js";

export const getOverview = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attendance = await Attendance.find({ studentId });
    const payments = await Payment.find({ studentId, isdeleted: false });
    const favourites = await Favorite.find({ studentId });

    const present = attendance.filter(a => a.status === "present").length;
    const percentage = attendance.length
      ? Math.round((present / attendance.length) * 100)
      : 0;

    let totalPaid = 0;
    let pendingAmount = 0;

    payments.forEach(p => {
      if (p.status.toLowerCase() === "completed") {
        totalPaid += p.amount;
      } else {
        pendingAmount += p.amount;
      }
    });

    res.status(200).json({
      status: true,
      data: {
        totalCourses: favourites.length,
        attendancePercentage: percentage,
        totalPaid,
        pendingAmount
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
