import mongoose from "mongoose";

let isConnected = false;

export const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  if (isConnected) {
    return;
  }

  // Recommended Mongoose options for modern drivers
  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;

  const db = mongoose.connection;
  db.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });
  db.once("open", () => {
    console.log("🗄️  Connected to MongoDB");
  });
};

export const disconnectMongo = async () => {
  if (!isConnected) {
    return;
  }
  await mongoose.disconnect();
  isConnected = false;
  console.log("🗄️  MongoDB connection closed");
};

export default mongoose;
