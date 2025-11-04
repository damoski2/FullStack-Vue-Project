import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import authRoutes from "./routes/auth.js";
import lessonsRoutes from "./routes/lessons.js";
import cartRoutes from "./routes/cart.js";
import enrollmentRoutes from "./routes/enrollment.js";
import userRoutes from "./routes/users.js";

// Import middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { initDatabase } from "./config/database.js";
import { connectMongo } from "./config/mongo.js";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "AfterSchool Hub API is running",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Prefer MongoDB if configured; otherwise fall back to SQLite
    if (process.env.MONGO_URI) {
      await connectMongo();
    } else {
      await initDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🚀 AfterSchool Hub API server running on port ${PORT}`);
      console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
