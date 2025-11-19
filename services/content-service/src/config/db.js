import mongoose from "mongoose";

const db = process.env.content_db || "content-test"

const uri = `mongodb+srv://db_user_2:ozBiZ0slw2U7kdOb@corzaar.qqlripp.mongodb.net/checking?retryWrites=true&w=majority&appName=corzaar`


export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Error:", error.message);
  }
};
