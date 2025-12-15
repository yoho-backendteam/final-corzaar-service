import axios from "axios";
import dotenv from "@dotenvx/dotenvx"
dotenv.config()

export const getData = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching:", url, error.message);
    throw error; // IMPORTANT
  }
};

export const ProfileUpdate=async(id)=>{
  try {
    const response = await axios.patch(`${process.env.auth_url}/api/merchant/iscompleted/${id}`, { timeout: 5000 });
    return response.data;
  } catch (error) {
    console.error("❌ Error update profile:", error.message);
    throw error; // IMPORTANT
  }
}