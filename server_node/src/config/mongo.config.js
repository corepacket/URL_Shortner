import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const MONGOURL = process.env.MONGOURL || process.env.MONGODB_URI;

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGOURL, {
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}
export default connectToMongo;