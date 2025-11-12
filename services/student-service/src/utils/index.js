import { v4 as uuidv4 } from "uuid";

// Generate unique UUID 
export const generateUUID = () => uuidv4();

// Format a standard success response
export const successResponse = (res, message, data = {}) =>
  res.status(200).json({ success: true, message, data });

// Format error response
export const errorResponse = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });

// utils/calculateTotals.js
export const calculateTotals = (items = [], coupon = null) => {
  let subtotal = items.reduce((acc, item) => acc + (item.discountPrice || item.price), 0);
  let discount = 0;

  // 🏷️ Apply coupon if provided
  if (coupon && coupon.code) {
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountAmount) / 100;
    } else if (coupon.discountType === "fixed") {
      discount = coupon.discountAmount;
    }
  }

  const discountedSubtotal = subtotal - discount;
  const tax = +(discountedSubtotal * 0.18).toFixed(2); // 18% GST
  const total = +(discountedSubtotal + tax).toFixed(2);

  return {
    subtotal,
    discount,
    tax,
    total,
    currency: "INR",
  };
};

