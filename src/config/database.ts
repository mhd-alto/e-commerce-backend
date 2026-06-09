const mongoose = require("mongoose");
const { getEnv } = require("./env");

async function connectDB() {
  const { MONGODB_URI } = getEnv();

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = { connectDB };

export { connectDB };
