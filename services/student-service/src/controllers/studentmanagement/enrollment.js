import CartCourses from "../../models/cart/index.js";
import Enrollment from "../../models/studentmanagment/Enrollment.js";
import student_management from "../../models/studentmanagment/student_management.js";
import { GetCourseDataForCart, GetPaymentById } from "../../utils/cart/index.js";
import { createOrderValidation } from "../../validations/studentmanagement/enrollment.js";
import mongoose from "mongoose";



export const createOrderController = async (req, res) => {
  try {
    const user = req.user
    const cartId = req.body.cartId
    const paymentId = req.body.paymentId

    // const { error, value } = createOrderValidation.validate(req.body, {
    //   abortEarly: false,
    // });

    // if (error) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Validation failed",
    //     errors: error.details.map((err) => err.message),
    //   });
    // }

    const cart = await CartCourses.findOne({_id:cartId})
    // const payment = await GetPaymentById(paymentId)
    const student = await student_management.findOne({userId:user?._id})

    const {data} = await GetCourseDataForCart({item:cart?.items})
    
    const output = {...cart._doc,items:data}

    const items =[]

    output.items.forEach((data)=>{
        const item = {
          courseId:data?._id,
          title:data?.title,
          price:data?.pricing?.price,
          instituteId:data?.instituteId?._id
        }

        items.push(item)
    })

    const enroll = {
      userId:user?._id,
      items:items,
      pricing: {
        subtotal: output?.pricing?.subtotal,
        discount: output?.coupon?.discountAmount,
        tax: output?.pricing?.tax,
        total: output?.pricing?.total,
        currency:output?.pricing?.currency
      },
      payment: paymentId,
      billing: {
        firstName: student?.personalInfo?.firstName,
        lastName: student?.personalInfo?.lastName,
        email:student?.personalInfo?.email,
        phone: student?.personalInfo?.phoneNumber,
        address: student?.personalInfo?.address,
      },
    }

    const newOrder = new Enrollment(enroll);
    const savedOrder = await newOrder.save();

    await CartCourses.findOneAndUpdate({_id:cartId},{checkout:true})
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: savedOrder,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while creating order",
      error: err.message,
    });
  }
};





export const getAllOrdersController = async (req, res) => {
  try {
    
    const {
      userId,
      status,
      paymentStatus,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 10,
    } = req.query;


    const query = {};
    if (userId) query.userId = userId;
    if (status) query.status = status;
    if (paymentStatus) query["payment.status"] = paymentStatus;

    
    const skip = (Number(page) - 1) * Number(limit);

    
    const orders = await Enrollment.find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("userId");

    const totalOrders = await Enrollment.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      pagination: {
        totalOrders,
        currentPage: Number(page),
        totalPages: Math.ceil(totalOrders / limit),
      },
      data: orders,
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: err.message,
    });
  }
};






export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query; 
    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.max(Number(limit), 1);

    
    const query = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { orderId: id };

    const order = await Enrollment.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    
    const totalItems = order.items.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = order.items.slice(startIndex, startIndex + limitNum);

    const paginatedOrder = {
      ...order.toObject(),
      items: paginatedItems,
    };

    res.status(200).json({
      success: true,
      pagination: {
        totalItems,
        currentPage: pageNum,
        totalPages: Math.ceil(totalItems / limitNum),
      },
      data: paginatedOrder
    });

  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving order.",
      error: error.message
    });
  }
};







export const updateEnrollment = async(req,res)=>{
  try {

    const {id} = req.params
    const {status} = req.body

    const enrollment = await Enrollment.findByIdAndUpdate({_id:id}, {status}, {new: true})
    if(!enrollment)  return res.status(404).json({
      success: false,
      message: "Enrollment not found.",
      
    })

    res.status(200).json({
      success: true,
      message: "Enrollment updated successfully",
      data: enrollment
    })
    
  } catch (error) {
    console.error("Error retrieving order:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving order.",
      error: error.message
    });
  }
}