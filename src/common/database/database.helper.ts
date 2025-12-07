import mongoose from "mongoose";

let isConnected = false;

export async function connectDatabase(uri: string) {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });

    isConnected = db.connection.readyState === 1;
    console.log("MongoDB connected (cached state):", isConnected);
  } catch (err) {
    console.error("DB connection error:", err);
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
