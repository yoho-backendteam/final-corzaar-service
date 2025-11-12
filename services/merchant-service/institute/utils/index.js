import { v4 as uuidv4 } from "uuid";

// Generate unique UUID for institute
export const generateUUID = () => uuidv4();

// Validate GeoJSON coordinates
export const validateCoordinates = (coordinates) => {
  if (
    !Array.isArray(coordinates) ||
    coordinates.length !== 2 ||
    typeof coordinates[0] !== "number" ||
    typeof coordinates[1] !== "number"
  ) {
    throw new Error("Invalid coordinates format: [longitude, latitude]");
  }
  return true;
};

// Format a standard success response
export const successResponse = (res, message, data = {}) =>
  res.status(200).json({ success: true, message, data });

// Format error response
export const errorResponse = (res, message, status = 400) =>
  res.status(status).json({ success: false, message });
