import mongoose from "mongoose";

const connectToMongo = async () => {
  try {
    const MONGOURL = process.env.MONGOURL || process.env.MONGODB_URI;

    if (!MONGOURL) {
      throw new Error(
        "MongoDB connection URL is missing. Please set MONGOURL or MONGODB_URI in your Render environment variables."
      );
    }

    await mongoose.connect(MONGOURL);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message || error);
    throw error;
  }
};

export default connectToMongo;
