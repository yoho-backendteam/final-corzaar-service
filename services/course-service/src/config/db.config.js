import mongoose from "mongoose";

const db = process.env.course_db || "dev-v1"

const uri = `mongodb+srv://db_user_2:ozBiZ0slw2U7kdOb@corzaar.qqlripp.mongodb.net/checking?retryWrites=true&w=majority&appName=corzaar`


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