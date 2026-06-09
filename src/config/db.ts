import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  // Allow the app to boot even if DB is not configured.
  // This makes local development/testing easier and avoids hard crashes.
  if (!uri) {
    console.warn("MONGO_URI is missing. Skipping MongoDB connection.");
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    // Do not crash the entire server on DB failures.
  }
};
