import { v4 as uuidv4 } from "uuid";

// Generate unique UUID for institute
export const generateUUID = () => {
  const id = uuidv4(); 
  return id;
};
export const successResponse = (message, data = null) => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message, error = null) => ({
  success: false,
  message,
  error,
});
