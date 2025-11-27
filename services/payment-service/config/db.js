import mongoose from "mongoose";

const uri = `mongodb+srv://db_user_2:ozBiZ0slw2U7kdOb@corzaar.qqlripp.mongodb.net/checking?retryWrites=true&w=majority&appName=corzaar`;

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Can't connect DB:", error.message);
    }
};

export default connectDB;
