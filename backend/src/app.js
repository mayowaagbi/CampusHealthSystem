const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { config } = require("dotenv");
const fileUpload = require("express-fileupload");

const {
  authRoutes,
  userRoutes,
  appointmentRoutes,
  healthRoutes,
  emergencyRoutes,
  notificationRoutes,
} = require("./routes");

const {
  errorHandler,
  notFound,
  rateLimiter,
  authMiddleware,
} = require("./middleware");

const { connectDB } = require("./config/database");
const { logger } = require("./utils/logger");

// Load environment variables
config();

// Initialize Express
const app = express();

// Database connection
connectDB();

// Middleware pipeline
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(morgan("combined"));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Public routes
app.use("/api/auth", authRoutes);

// Authenticated routes
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/appointments", authMiddleware, appointmentRoutes);
app.use("/api/health-records", authMiddleware, healthRoutes);
app.use("/api/emergency", authMiddleware, emergencyRoutes);
app.use("/api/notifications", authMiddleware, notificationRoutes);
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
