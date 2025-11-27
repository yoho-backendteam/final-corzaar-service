import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

export const GetInstituteByUserId=async(id)=>{
    const response = await axios.get(`${process.env.merchant_url}/api/getbyuserId/${id}`).catch((err)=>{
        console.log(err)
    })
    return response.data
}

export const GetInstituteBId=async(id)=>{
    const response = await axios.get(`${process.env.merchant_url}/api/getforcourse/${id}`)
    .then((response)=>{
        return response?.data
    })
    .catch((err)=>{
        console.log(err)
    })
    return response
}