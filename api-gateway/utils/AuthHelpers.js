import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"

export const dirname = path.dirname(fileURLToPath(import.meta.url))


async function loadKeys() {
    try {
        const jwtPrivateKey =fs.readFileSync(path.join(dirname, '../private.key'), 'utf8');
        const jwtPublicKey =fs.readFileSync(path.join(dirname, '../public.key'), 'utf8');
        return { jwtPrivateKey, jwtPublicKey };
    } catch (error) {
        console.log(error)
    }
}
const { jwtPrivateKey, jwtPublicKey } = await loadKeys()

export const JWTEncoded = async(data)=>{
    try { 
        const token = jwt.sign({uuid:data?.uuid,role:data?.role,email:data?.email,_id:data?._id},jwtPrivateKey,{algorithm:'RS256',expiresIn:"30d"})
        return {
            token
        }

    } catch (error) {
        console.log(error)
        throw error
    }
}

export const JWTDecoded = async(data)=>{
    try {       
        const token = jwt.verify(data,jwtPublicKey,{algorithms:['RS256']})
        return token
    } catch (error) {
        if (error.message === "jwt expired") {
            return { status: "failed", message: error.message }
        }
        return { status: "failed", message: error.message, data: null }
    }
}

export const generateOtp = async()=>{
    const otp = Math.floor(100000 + Math.random() * 900000)
    const token =crypto.randomBytes(5).toString('hex')
    return {otp, token}
}

export const RandomNumbers = async()=>{
    const otp = Math.floor(1000 + Math.random() * 9000)
    return otp
}