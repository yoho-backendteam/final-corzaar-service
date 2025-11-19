import mongoose from "mongoose"

const db = process.env.payment_db || "payment-test"

const uri = `mongodb+srv://db_user_2:ozBiZ0slw2U7kdOb@corzaar.qqlripp.mongodb.net/checking?retryWrites=true&w=majority&appName=corzaar`


const connectDB = async () =>{
    try {
        await mongoose.connect(url)
        console.log("DB connected")
    } catch (error) {
        console.log("Can't connect DB")
        
    }

}
export default connectDB