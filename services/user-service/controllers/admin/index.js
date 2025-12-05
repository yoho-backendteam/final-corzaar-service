import { generateOtp } from "../../utils/AuthHelpers.js"
import { AdminModel } from "../../models/adminModel.js"
import { MerchantModel } from "../../models/merchantModel.js"
import { OtpModel } from "../../models/OtpModel.js"
import bcrypt from "bcrypt"
import { JWTEncoded } from "../../utils/AuthHelpers.js"

export const AdminRegister = async (req, res) => {
    try {
        const { email, password } = req.body

        const existuser = await AdminModel.findOne({ email })

        if (existuser) {
            return res.status(200).json({ status: false, message: "admin user already exist" })
        } else {

            const hashpass = bcrypt.hashSync(password, 13)

            const user = new AdminModel({
                email,
                password: hashpass,
            })

            await user.save()

            res.status(201).json({ status: true, message: "admin created successfully." })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const AdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await AdminModel.findOne({ email })

        if (!user) {
            return res.status(404).json({ status: false, message: "user not found" })
        }

        const verify = bcrypt.compareSync(password, user?.password)

        if (!verify) {
            return res.status(400).json({ status: false, message: "incorrect password" })
        }

        const token = await JWTEncoded({ email: user?.email, _id: user?._id, OAuth_id: user?.OAuth_id, role: user?.role, phoneNumber: user?.phoneNumber })

        res.status(200).json({ status: true, message: "login successfully", data: token })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const GetAdminProfile = async (req, res) => {
    try {
        const user = req.user

        res.status(200).json({ status: true, message: "profile data fetched", data: user })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const GetAdminProfileById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await AdminModel.findOne({ _id: id }).select("-password")

        res.status(200).json({ status: true, message: "profile data fetched", user })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}


export const ChangeAdminPassword = async (req, res) => {
    try {
        const user = req.user
        const { oldPassword, confirmPassword } = req.body

        const existuser = await AdminModel.findOne({ _id: user?._id })

        const oldvrify = bcrypt.compareSync(oldPassword, existuser?.password)

        if (!oldvrify) {
            return res.status(400).json({ status: false, message: "old password is incorrect" })
        }

        const hashpass = bcrypt.hashSync(confirmPassword, 13)

        await MerchantModel.findOneAndUpdate({ root_id: user?._id }, { password: hashpass })

        res.status(201).json({ status: true, message: "password updated successfully" })
    } catch (error) {
        req.status(500).json({ status: false, message: error.message })
    }
}