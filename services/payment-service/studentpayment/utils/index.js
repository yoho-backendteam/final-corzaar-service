import { v4 as uuidv4 } from "uuid";

// Generate unique UUID for institute
export const generateUUID = () => uuidv4();

// Format a standard success response
export const successResponse = (res, message, data = {}) =>
  res.status(200).json({ success: true, message, data });

// Format error response
export const errorResponse = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });