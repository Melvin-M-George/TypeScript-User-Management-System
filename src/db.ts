import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const dbUri = process.env.MONGO_URI || "";

const connectDb = async () => {
   try {
    await mongoose.connect(dbUri);
    console.log("DB connected")
   } catch (error) {
    console.error("Error connecting to db")
    process.exit(1);
   } 
}

export default connectDb;