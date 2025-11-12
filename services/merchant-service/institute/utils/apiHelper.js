import axios from "axios";

export const getData = async (url) => {
  try {
    const response = await axios.get(url).catch((err)=>{console.log(err)});
    return response?.data;
  } catch (error) {
    console.error("Error fetching data from:", url, error.message);
    return null;
  }
};
