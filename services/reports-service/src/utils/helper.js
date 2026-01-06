import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export const GetInstituteByUserId=async(id)=>{
    const response = await axios.get(`${process.env.merchant_url}/api/getbyuserId/${id}`)
    .catch((err)=>{
        console.log(err)
    })
    if (response.data) {
        return response?.data
    }else{
        return response
    }
}

export const getData = async(url) => {
    try {
        const response = await axios.get(url,{})
        return response;
    } catch (error) {
      console.log(error)  
    }
}