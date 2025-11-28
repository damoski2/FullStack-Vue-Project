import mongoose from "mongoose";

let isConnected = false;

export const connectMongo = async () => {
  const mongoUri =
    process.env.MONGO_URI ||
    "mongodb+srv://akogunoyindamola42_db_user:damodami43@cluster0.9dkiijj.mongodb.net/AFTER-SCHOOL-HUB-API?appName=Cluster0";
  if (!mongoUri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  if (isConnected) {
    console.log("🗄️  MongoDB already connected");
    return;
  }

  // Set up event listeners BEFORE connecting
  const db = mongoose.connection;

  db.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err);
    isConnected = false;
  });

  db.on("disconnected", () => {
    console.log("⚠️  MongoDB disconnected");
    isConnected = false;
  });

  db.once("open", () => {
    console.log("🗄️  Connected to MongoDB");
    isConnected = true;
  });

  // Connect to MongoDB
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });

    // Check if already connected (in case connection was instant)
    if (mongoose.connection.readyState === 1) {
      console.log("🗄️  Connected to MongoDB");
      isConnected = true;
    }
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    isConnected = false;
    throw error;
  }
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
