import mongoose from "mongoose";
import axios from "axios";
import { successResponse, errorResponse } from "../../utils/index.js";
import { calculateTotals } from "../../utils/index.js";
import CartCourses from "../../model/cart/index.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, courseId, title, price, discount, instituteId, payment, } = req.body;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "Invalid userId format");
    }
    if (!userId || !courseId) {
      return errorResponse(res, "userId and courseId are required");
    }
    const paymentData = payment || {
      method: "UPI",
      status: "pending",
    };

    const studentApiUrl = `${process.env.STUDENT_API}/${userId}`;
    const studentResponse = await axios.get(studentApiUrl);

    const student = studentResponse?.data?.data;
    if (!student) return errorResponse(res, "Student not found in Student Service");

    const studentName =
      student.studentName ||
      `${student.personalInfo?.firstName || ""} ${student.personalInfo?.lastName || ""}`.trim();

    const email = student.personalInfo?.email || "unknown@email.com";
    const phoneNumber = student.personalInfo?.phoneNumber || "0000000000";
    const address =
      student.personalInfo?.address?.permanent || student.address?.permanent || {};
    let cart = await CartCourses.findOne({ userId, isactive: true, isdeleted: false });

    if (!cart) {
      cart = new CartCourses({
        userId,
        cartname: `${studentName || "Student"}'s Cart`,
        items: [],
        billing: {
          firstName: student.personalInfo?.firstName || "Unknown",
          lastName: student.personalInfo?.lastName || "",
          email,
          phone: phoneNumber,
          address,
        },
        payment: paymentData,
      });
    } else {
      cart.payment = paymentData;
    }
    const existingItem = cart.items.find((i) => i.courseId === courseId);
    if (existingItem) {
      return successResponse(res, "Course already in cart", cart);
    }
    cart.items.push({
      courseId,
      title,
      price,
      discountPrice: discount || 0,
      instituteId,
    });
    await cart.save();
    return successResponse(res, "Item added to cart", cart);
  } catch (err) {
    return errorResponse(res, err.message || "Server error");
  }
};

export const getCart = async (req, res) => {
  try {
    let { userId } = req.query;

    if (!userId) return errorResponse(res, "userId is required");

  
    userId = userId.trim();
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "Invalid userId format");
    }

    const cart = await CartCourses.findOne({
      userId,
      isdeleted: false,
      isactive: true,
    });

    if (!cart) return errorResponse(res, "No active cart found for this user");

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



