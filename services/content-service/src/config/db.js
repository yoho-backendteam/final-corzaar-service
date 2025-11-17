import mongoose from "mongoose";

const db = process.env.content_db || "content-test"

const uri = `mongodb+srv://yoho_db_users:825le4CGbRwwGTx9@corzaar.qqlripp.mongodb.net/${db}?retryWrites=true&w=majority&appName=corzaar`


export const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(" MongoDB Error:", error.message);
  }
};
