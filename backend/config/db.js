import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(`MongoDB connection error: ${error}`);
    process.exit(1); // Optional: stop server if DB fails to connect
  }
};

export default dbConnect;
