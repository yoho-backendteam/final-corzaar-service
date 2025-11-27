import axios from "axios";
import dotenv from "@dotenvx/dotenvx"
dotenv.config()

export const calculateTotals = (items = [], coupon = null) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const itemDiscounts = items.reduce((sum, item) => sum + (item.discountPrice || 0), 0);
  const couponDiscount = coupon?.discountAmount || 0;
  const totalDiscount = itemDiscounts + couponDiscount;
  const tax = 0; 
  const total = subtotal - totalDiscount + tax;

  return { subtotal, discount: totalDiscount, tax, total, currency: "INR" };
};

export const GetCourseDataByid=async(id)=>{
 const res = axios.get(`${process.env.course_url}/api/courses/getCourseById/${id}`,{
    headers:{user:JSON.stringify({role:"open"})}
  })
  .then((response)=>{
    return response?.data
  })
  .catch((err)=>{
    console.error("course fetching error:",err)
  })

  return res
}

export const GetCourseDataForCart=async(data)=>{
 const res = axios.post(`${process.env.course_url}/api/courses/courseincart`,data,{
    headers:{user:JSON.stringify({role:"open"})}
  })
  .then((response)=>{
    return response?.data
  })
  .catch((err)=>{
    console.error("course fetching error:",err)
  })

  return res
}

export const UpdateProfileFlagAxios=async(id)=>{
  await axios.patch(`${process.env.auth_url}/api/users/iscompleted/${id}`)
}

export const GetPaymentById=async(id)=>{
 const res = axios.get(`${process.env.payment_url}/api/student/${id}/get`,{
    headers:{user:JSON.stringify({role:"open"})}
  })
  .then((response)=>{
    return response?.data
  })
  .catch((err)=>{
    console.error("payment fetching error:",err)
  })

  return res
}