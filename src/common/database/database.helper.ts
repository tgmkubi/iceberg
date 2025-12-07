import mongoose from "mongoose";

export async function connectDatabase(uri: string) {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB Atlas");
  } catch (err) {
    console.error("Database disconnection error:", err);
    throw err;
  }
}
