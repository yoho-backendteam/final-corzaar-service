import Payment from "../../../user-service/models/usersettingModel/PaymentModel.js";

export const getPayments = async (req, res) => {
  try {
    const studentId = req.user._id;

    const payments = await Payment.find({
      studentId,
      isdeleted: false
    }).sort({ createdAt: -1 });

    const completed = [];
    const pending = [];

    payments.forEach(p => {
      const obj = {
        amount: p.amount,
        paymentMethod: p.paymentMethod,
        transactionId: p.transactionId,
        status: p.status,
        date: p.createdAt
      };

      if (p.status.toLowerCase() === "completed") {
        completed.push(obj);
      } else {
        pending.push(obj);
      }
    });

    res.status(200).json({
      status: true,
      data: {
        completed,
        pending
      }
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
