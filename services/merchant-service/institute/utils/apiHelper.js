import axios from "axios";

export const getData = async (url) => {
  try {
    const response = await axios.get(url, { timeout: 8000 });
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching:", url, error.message);
    throw error; // IMPORTANT
  }
};
