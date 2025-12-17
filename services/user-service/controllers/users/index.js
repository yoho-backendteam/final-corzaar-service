import { generateOtp, JWTEncoded } from "../../utils/AuthHelpers.js"
import { OtpModel } from "../../models/OtpModel.js"
import { UserModel } from "../../models/usermodel.js"
import bcrypt from "bcrypt"
import { logActivity } from "../../utils/ActivitylogHelper.js"

export const UsersMobileRegister = async (req, res) => {
    try {
        const { phoneNumber } = req.body

        const existuser = await UserModel.findOne({ phoneNumber })

        if (existuser) {
            const { otp, token } = await generateOtp()
            await OtpModel.create({
                otp,
                token,
                phoneNumber: existuser?.phoneNumber,
                role: "student"
            })

            res.status(200).json({ status: true, message: "enter your otp", data: { otp, token } })

        } else {
            const user = new UserModel({
                phoneNumber
            })

            await user.save()

            const { otp, token } = await generateOtp()
            await OtpModel.create({
                otp,
                token,
                phoneNumber: user?.phoneNumber,
                role: "student"
            })

            res.status(200).json({ status: true, message: "enter your otp", data: { otp, token } })
        }
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const UsersRootLogin = async (req, res) => {
    try {
        const { email, phoneNumber, password } = req.body
        const user = await UserModel.findOne({ $or: [{ email }, { phoneNumber }], ispass: false })

        if (!user) {
            return res.status(200).json({ status: false, message: "only accepted otp login in phone number." })
        }

        const verify = bcrypt.compareSync(password, user?.password)

        if (!verify) {
            return res.status(400).json({ status: false, message: "password incorrect." })
        }

        const token = await JWTEncoded({ email: user?.email, _id: user?._id, OAuth_id: user?.OAuth_id, role: user?.role, phoneNumber: user?.phoneNumber })
        logActivity({
            userid: user._id.toString(),
            actorRole: user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "",
            action: "Login",
            description: `${user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"} logged in successfully`,
        });


        res.status(200).json({ status: true, message: "login success", data: token })

    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const GetUserProfile = async (req, res) => {
    try {
        const user = req.user

        res.status(200).json({ status: true, message: "profile data fetched", data: user })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const GetUserProfileById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await UserModel.findOne({ _id: id }).select("-password")

        res.status(200).json({ status: true, message: "profile data fetched", user })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}

export const UpdateProfileComplted = async (req, res) => {
    try {
        const { id } = req.params

        const user = req.user;
        await UserModel.updateOne({ _id: id }, { is_completed: true })
        logActivity({
            userid: user._id.toString(),
            actorRole: user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "",
            action: "Profile",
            description: `${user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                : "User"} Profile Updated successfully`,
        });



        res.status(200).json({ status: true, message: "profile data fetched" })
    } catch (error) {
        res.status(500).json({ status: false, message: error.message })
    }
}