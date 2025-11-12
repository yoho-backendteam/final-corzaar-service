import mongoose from "mongoose"

const db = process.env.report_db || "report-test"

const url = `mongodb+srv://yoho_db_users:kSNmUnKZnl3FCETd@corzaar.qqlripp.mongodb.net/${db}?retryWrites=true&w=majority&appName=corzaar`

const connectDB = async () =>{
    try {
        await mongoose.connect(url)
        console.log("DB connected")
    } catch (error) {
        console.log("Can't connect DB")
        
    }

}
export default connectDB