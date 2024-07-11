import mongoose from "mongoose";
import configs from "../config";

async function connectMongoDB() {
  try {
    await mongoose.connect(
    configs.mongodbUrl
    );
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Re-throw to propagate the error
  }
}

export { connectMongoDB };