import mongoose from "mongoose";

const db = process.env.notification_db || "notification-test"

// const uri = `mongodb+srv://yoho_db_users:kSNmUnKZnl3FCETd@corzaar.qqlripp.mongodb.net/${db}?retryWrites=true&w=majority&appName=corzaar`

const uri = `mongodb+srv://yoho_db_users:kSNmUnKZnl3FCETd@corzaar.qqlripp.mongodb.net/dev-v1?retryWrites=true&w=majority&appName=corzaar`


const connectionOption = {}

mongoose
    .connect(uri,connectionOption)
    .then(()=>{
        console.log("mongodb connected successfully")
    })
    .catch((err)=>{
        console.error("mongodb conntect error:",err)
    })

export default mongoose.connection