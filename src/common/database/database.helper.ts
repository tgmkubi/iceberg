import mongoose from "mongoose";

let isConnected = false;

export async function connectDatabase(uri: string) {
  if (isConnected || mongoose.connection.readyState === 1) return;

  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      maxPoolSize: 5,
      family: 4, // prefer IPv4 to avoid IPv6 issues in serverless
    });

    isConnected = db.connection.readyState === 1;
    console.log("MongoDB connected (cached state):", isConnected);
  } catch (err) {
    console.error("DB connection error:", err);
    throw err;
  }
}

export async function disconnectDatabase() {
  try {
    await mongoose.disconnect();
    isConnected = false;
    console.log("Disconnected from MongoDB Atlas");
  } catch (err) {
    console.error("Database disconnection error:", err);
    throw err;
  }
}
