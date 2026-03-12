import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import complaintRoutes from "./routes/complaint.routes.js";
import cors from "cors";
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Static folder for uploaded images
app.use("/public", express.static("public"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/complaints", complaintRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Smart Campus Complaint Management API running");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});