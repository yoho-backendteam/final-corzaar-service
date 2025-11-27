import { createInstitutePaymentManualValidation } from '../../validation/index.js';
import axios from'axios'
import { InstitutePayment } from '../models/paymentSchema.js';

// http://localhost:3002/api/merchant/getall

const getData = async(url) => {
    try {
        const response = await axios.get(url)
        return response?.data
    } catch (error) {
        console.log(error)
    }
}

// create payment request
export const createPayment = async (req, res) => {

  try {
        const {error, value} = createInstitutePaymentManualValidation.validate(req.body)
        if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const data = await getData("http://localhost:3002/api/getall")

    const verifyId = data.data.some((merchant) => merchant._id === value.instituteId);

    if(!verifyId) return res.status(400).json({
        success: false,
        message: "institute not found"
      })

    const manualPayment = new InstitutePayment(value)
    await manualPayment.save();

    res.status(200).json({status: true,message : "success",data : manualPayment})
    
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// get payment bill by id
export const getInstitutePaymentRequests = async (req, res) => {
  try {
    const { instituteId } = req.params;
    const requests = await InstitutePayment.find({ instituteId })
      .sort({ createdAt: -1 });

    res.status(200).json({status:true, message : "successfully fetched data", data: requests });
  } catch (error) {
    res.status(500).json({status:false, message: error.message });
  }
};

// get all payment
export const getAllInstitutePaymentRequests = async(req,res) => {
  try {
    const getAll = await InstitutePayment.find({isdeleted : false})
    res.status(200).json({status: true, 
    message: "successfully fetched all datas",
    data: getAll })
  } catch (error) {
    res.status(500).json({
      status: false,
      Error:error
    })
  }
}

// update Institute Payment
export const updateInstitutePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const updated = await InstitutePayment.findByIdAndUpdate(paymentId, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ status: true, message: "Payment updated", data : updated });
  } catch (error) {
    res.status(500).json({ status:false, message: error.message });
  }
};

// delete Institute payment
export const deleteInstitutePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await InstitutePayment.findByIdAndDelete(paymentId);
    if (!payment) return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get payment by month & year wise
export const getInstitutePaymentByMonthwithYear = async(req,res) => {
  try {
    const { month,year } = req.query
    const getData = await InstitutePayment.find({month,year}).sort({createdAt:-1})
    res.status(200).json({status:true,message:"successfull fetched monthly wise data", data:getData})
  } catch (error) {
   res.status(500).json({ message: error.message });
   }
}

// get payment by month wise
export const getInstitutePaymentByMonth = async(req,res) => {
  try {
    const { month } = req.query
    const getData = await InstitutePayment.find({month}).sort({createdAt:-1})
    res.status(200).json({status:true,message:"successfull fetched monthly wise data", data:getData})
  } catch (error) {
   res.status(500).json({ message: error.message });
   }
}

// get payment by month wise
export const getInstitutePaymentByYear = async(req,res) => {
  try {
    const { year } = req.query
    const getData = await InstitutePayment.find({year}).sort({createdAt:-1})
    res.status(200).json({status:true,message:"successfull fetched monthly wise data", data:getData})
  } catch (error) {
   res.status(500).json({ message: error.message });
   }
}