import axios from "axios"
import dotenv from "@dotenvx/dotenvx"

export const GetInstituteByUserId=async(id)=>{
    const response = await axios.get(`${process.env.merchant_url}/api/getbyuserId/${id}`).catch((err)=>{
        console.log(err)
    })
    return response.data
}