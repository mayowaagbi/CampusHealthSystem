const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const healthRoutes = require("./routes/healthRecordRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const fileRoutes = require("./routes/fileRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const waterRoutes = require("./routes/waterRoutes");
const { authenticate } = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const apiLimiter = require("./middleware/rateLimiter");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { connectDB } = require("./config/database");
const logger = require("./utils/logger");

// Load environment variables
config();

// Initialize Express
const app = express();

// Middleware pipeline
app.use(helmet());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// Public routes
app.use("/api/auth", authRoutes);

// Authenticated routes
app.use("/api/users", authenticate, userRoutes);
app.use("/api/appointments", authenticate, appointmentRoutes);
app.use("/api/health-records", authenticate, healthRoutes);
app.use("/api/emergency", authenticate, emergencyRoutes);
app.use("/api/notifications", authenticate, notificationRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/ambulance", ambulanceRoutes);
app.use("/api/water", waterRoutes);

// Add after other middleware
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Add routes
// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`Docs available at /api/docs`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received: Closing server");
  process.exit(0);
});

module.exports = app;
