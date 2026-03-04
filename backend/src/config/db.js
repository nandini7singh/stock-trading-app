import mongoose from "mongoose";
import config from "./config.js";

const { MONGO_URI } = config;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Mongo Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;