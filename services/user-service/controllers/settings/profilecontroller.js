import axios from "axios";
import Profile from "../../models/setting/prosileschema.js";
import dotenv from "dotenv";
import { AdminModel } from "../../models/adminModel.js";
import { logActivity } from "../../utils/ActivitylogHelper.js";
dotenv.config();

export const getProfile = async (req, res) => {
  try {
    const user = req.user
    const data = await AdminModel.findOne({ _id: user?._id })
    return res.status(200).json({ response: data });
  } catch (error) {
    console.error("Error fetching profile:", error.response?.data || error.message);
    throw error;
  }
};



const API_URL = "http://localhost:3009";

export const updateProfile = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const user=req.user
  try {
    const response = await AdminModel.find(updateData);
    logActivity({
      userid: user._id.toString(),
      actorRole: user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "",
      action: "Profile",
      description: `${user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "User"}Profle Update successfully`,
    });

    res.status(200).json({
      response: response.data,
      Message: "Updated successfully",
      Status: "Success"
    });
  } catch (error) {
    console.error("Error updating profile:", error.response?.data || error.message);
    throw error;
  }
};

export const ChangeAdminPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, _id } = req.body;

    const response = await axios.put(`http://localhost:3009/admin/change-pass`, {
      oldPassword,
      confirmPassword: newPassword,
      _id
    });

    // ✅ Success
    return res.status(200).json(response.data);

  } catch (error) {
    console.error("Error changing password:", error.response?.data || error.message);

    // ✅ Forward backend message properly
    const statusCode = error.response?.status || 500;
    const backendMessage =
      error.response?.data?.message || "Something went wrong while updating password";

    return res.status(statusCode).json({
      status: false,
      message: backendMessage,
    });
  }
};
