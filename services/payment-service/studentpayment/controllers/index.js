import axios from "axios";
import PaymentTransaction from "../models/index.js";
import { errorResponse, generateUUID, successResponse } from "../utils/index.js";
import mongoose from "mongoose"

export const createPayment = async (req, res) => {
  try {
    const data = req.body;

    if (!data.studentId) {
      return errorResponse(res, "Student ID is required");
    }

    // ✅ Fetch student details from correct API endpoint
    const studentApiUrl = `http://localhost:${process.env.student_service_url}/student_management/getbyid/${data.studentId}`;
    const studentResponse = await axios.get(studentApiUrl);
    const student = studentResponse?.data?.data;
    if (!student) {
      return errorResponse(res, "Student not found in student service");
    }

    data.studentName = student.studentName || student.name || "Unknown Student";


    const payment = new PaymentTransaction(data);
    await payment.save();

    return successResponse(res, "Payment transaction successful", payment);
  } catch (error) {

    return errorResponse(res, error.message);
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const payments = await PaymentTransaction.find({ instituteId: id.toString() });

    let message = "";
    let data = [];

    if (!payments || payments.length === 0) {
      message = "No payments found for this institute";
    } else {
      message = "Students payment fetched successfully";
      data = payments;
    }

    return res.status(200).json({
      status: "success",
      success: true,
      message: `${message}`, 
      data,
    });

  } catch (error) {
    return res.status(500).json({
      status: "error",
      success: false,
      message: `${error.message}`, 
    });
  }
};


export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const payment = await PaymentTransaction.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    if (!payment) return errorResponse(res, "student not found", 404);
    return successResponse(res, "transaction details updated  successfully", payment);
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export const getByIDPayment = async (req, res) => {
  try {
    let { studentId, instituteId } = req.params;


    // 
    studentId = (studentId || "").replace(/['"\r\n\s]/g, "");
    instituteId = (instituteId || "").replace(/['"\r\n\s]/g, "");

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid studentId format",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(instituteId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid instituteId format",
      });
    }

    // ✅ Fetch all payments
    const payments = await PaymentTransaction.find({
      studentId,
      instituteId,
      isdeleted: false,
    });

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found for this student in this institute",
      });
    }

    return successResponse(res, "Payments fetched successfully", payments);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const deletepaymentbyid = async (req, res) => {
  try {
    const { id } = req.params
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    const deletedpayment = await PaymentTransaction.findByIdAndDelete(id)
    if (!deletedpayment) {
      return res.status(404).json({ message: "payment not found" })
    }

    res.status(200).json({ message: "deleted payment", deletedpayment })

  } catch (error) {
    res.status(500).json({ message: "error" })
  }
}
export const trackPayments = async (req, res) => {
  try {
    const { type, status, paymentMethod, } = req.query;
    const filter = { isdeleted: false };

    if (type) filter.type = { $regex: type, $options: "i" }; // e.g., Fee, Refund, Commission, Payout
    if (status) filter.status = { $regex: status, $options: "i" }; // e.g., Pending, Completed, Failed
    if (paymentMethod) filter.paymentMethod = { $regex: paymentMethod, $options: "i" }; // e.g., UPI, Card

    if (Object.keys(filter).length === 1) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one search parameter.",
      });
    }

    const payments = await PaymentTransaction.find(filter).sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found matching the search criteria.",
      });
    }

    return successResponse(res, "Payments fetched successfully", payments);
  } catch (error) {
    return errorResponse(res, error.message);
  }
};

export const getallpayementfull = async (req, res) => {
  try {
    const payments = await PaymentTransaction.find({isdeleted: false });
    return successResponse(res, "payment fetched successfully", payments);
  } catch (error) {
    return errorResponse(res, error.message);
  }
}