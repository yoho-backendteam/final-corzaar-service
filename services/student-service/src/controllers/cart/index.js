import mongoose from "mongoose";
import axios from "axios";
import { successResponse, errorResponse } from "../../utils/index.js";
import { calculateTotals } from "../../utils/index.js";
import CartCourses from "../../models/cart/index.js";
import Student from "../../models/studentmanagment/student_management.js";
import { GetBatchData, GetCourseDataByid, GetCourseDataForCart } from "../../utils/cart/index.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user?._id
    const {courseId} = req.params
    const {batchId}=req.params

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "Invalid userId format");
    }

    if (!userId || !courseId) {
      return errorResponse(res, "userId and courseId are required");
    }

    // Fetch student info
    const student = await Student.findOne({userId});
    if (!student) return errorResponse(res, "Student not found");

    const data = await GetCourseDataByid(courseId)

    if (!data) {
      return errorResponse(res, "course not found");
    }
    
    let cart = await CartCourses.findOne({ userId, checkout:false });


    if (!cart) {
      cart = new CartCourses({
        userId,
        items:[] ,
        status: "pending",
      });
    } 
    const existingItem = cart.items.find((i) => i?.courseId === data?._id);
    if (existingItem) {
      return successResponse(res, "Course already in cart", cart);
    }

    const batch = await GetBatchData(data?._id,batchId)

    if (batch) {
      if (parseInt(batch?.totalSeats) != parseInt(batch?.seatFilled)) {
        
        const subtotal = cart?.pricing?.subtotal + data?.pricing?.price

        const total = subtotal
        cart.pricing.subtotal = subtotal
        cart.pricing.total = total
        cart.items.push({courseId:data?._id,batchId:batch?._id});

        await cart.save();
        return successResponse(res, "Item added to cart",cart);
      }else{
        return errorResponse(res, "batch seats are already filled..");
      }
    }else{
       return errorResponse(res, "batch not found");
    }

  } catch (err) {
    console.error("Add to cart error:", err);
    return errorResponse(res, err.message || "Server error");
  }
};

export const getCart = async (req, res) => {
  try {
    let userId = req.user?._id;

    if (!userId) return errorResponse(res, "userId is required");

  
    userId = userId.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "Invalid userId format");
    }

    const cart = await CartCourses.findOne({
      userId,
      checkout:false
    });

    if (!cart) return errorResponse(res, "No active cart found for this user");

    const {data} = await GetCourseDataForCart({item:cart?.items})

    const output = {...cart._doc,items:data}

    return successResponse(res, "Cart retrieved successfully", output);
  } catch (err) {
    return errorResponse(res, err.message || "Server error");
  }
};

export const getCartById = async (req, res) => {
  try {
    const {id} = req.params;

    const cart = await CartCourses.findOne({_id:id});

    if (!cart) return errorResponse(res, "No active cart found for this user");

    // const {data} = await GetCourseDataForCart({item:cart?.items})

    // const output = {...cart._doc,items:data}

    return successResponse(res, "Cart retrieved successfully", cart);
  } catch (err) {
    return errorResponse(res, err.message || "Server error");
  }
};

export const removeItem = async (req, res) => {
  try {
    const { userId } = req.body; // comes from validator
    const { id: courseId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courseId)) {
      return errorResponse(res, "Invalid userId or courseId format");
    }

    const cart = await CartCourses.findOne({ userId, isactive: true, isdeleted: false });
    if (!cart) return errorResponse(res, "Cart not found");

   
    const itemIndex = cart.items.findIndex(
      (item) => item.courseId.toString() === courseId.toString()
    );

    if (itemIndex === -1) {
      return errorResponse(res, "Course not found in cart");
    }

    cart.items.splice(itemIndex, 1);
    cart.pricing = calculateTotals(cart.items, cart.coupon);

    // If cart is empty, optionally mark inactive or delete
    if (cart.items.length === 0) {
      cart.isactive = false;
    }

    await cart.save();

    return successResponse(res, "Item removed from cart", cart);
  } catch (err) {
    return errorResponse(res, err.message || "Server error");
  }
};


export const clearCart = async (req, res) => {
  try {
    let { userId } = req.body;
    if (!userId) return errorResponse(res, "userId is required");

    userId = userId.trim();
    if (!mongoose.Types.ObjectId.isValid(userId))
      return errorResponse(res, "Invalid userId format");

    const cart = await CartCourses.findOne({ userId, isactive: true });
    if (!cart) return errorResponse(res, "Cart not found");

    cart.items = [];
    cart.pricing = calculateTotals([], null);
    await cart.save();

    return successResponse(res, "Cart cleared successfully", cart);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};


export const applyCoupon = async (req, res) => {
  try {
    const { userId, code, discountAmount, discountType } = req.body;

    const cart = await CartCourses.findOne({ userId, isactive: true });
    if (!cart) return errorResponse(res, "Cart not found");

    cart.coupon = { code, discountAmount, discountType };
    cart.pricing = calculateTotals(cart.items, cart.coupon);
    await cart.save();

    return successResponse(res, "Coupon applied", cart);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};

export const removeCoupon = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await CartCourses.findOne({ userId, isactive: true });
    if (!cart) return errorResponse(res, "Cart not found");

    cart.coupon = { code: "", discountAmount: 0, discountType: "fixed" };
    cart.pricing = calculateTotals(cart.items, cart.coupon);
    await cart.save();

    return successResponse(res, "Coupon removed", cart);
  } catch (err) {
    return errorResponse(res, err.message);
  }
};



