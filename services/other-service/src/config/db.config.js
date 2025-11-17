import mongoose from "mongoose";

const db = process.env.other_db || "other-test"

const uri = `mongodb+srv://yoho_db_users:825le4CGbRwwGTx9@corzaar.qqlripp.mongodb.net/${db}?retryWrites=true&w=majority&appName=corzaar`

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