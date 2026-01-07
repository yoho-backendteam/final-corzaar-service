import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export const GetInstituteByUserId=async(id)=>{
    const response = await axios.get(`http://localhost:${process.env.merchant_service_url}/api/getbyuserId/${id}`).catch((err)=>{
        console.log(err)
    })
    console.log(response,"ress")
    return response?.data
}

export const getData = async(url) => {
    try {
        const response = await axios.get(url,{})
        return response;
    } catch (error) {
      console.log(error)  
    }
}