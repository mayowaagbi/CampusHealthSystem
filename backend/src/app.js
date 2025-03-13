const express = require("express");
const { config } = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");

// Load environment variables
config();

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const emergencyRoutes = require("./routes/emergencyRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const fileRoutes = require("./routes/fileRoutes");
const waterRoutes = require("./routes/waterRoutes");
const georoutes = require("./routes/geoRoutes");
const entryRoutes = require("./routes/entryRoutes");
const ambulanceRoutes = require("./routes/ambulanceRoutes");
const healthRoutes = require("./routes/healthRoutes");
const goalRoutes = require("./routes/goalRoutes");
const profileRoutes = require("./routes/profileRoutes");
const documentRoutes = require("./routes/documentRoutes");
const healthproviderdashboardRoutes = require("./routes/healthproviderdashboardRoutes");
const studentRoutes = require("./routes/studentRoutes");
const supportRoutes = require("./routes/supportRoutes");
const alertRoutes = require("./routes/alertRoutes");
// Import middleware
const { authenticate } = require("./middleware/authMiddleware");
const apiLimiter = require("./middleware/rateLimiter");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const { setupSocketHandlers, initialize } = require("./utils/sockets");
const { authenticateSocket } = require("./utils/sockets");

// Import utilities
const logger = require("./utils/logger");

// Initialize Express
const app = express();
const httpServer = createServer(app);

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
app.use(
  fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 },
    abortOnLimit: true,
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Store connected users
const users = new Map();

// Configure Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
  path: "/socket.io/",
  transports: ["websocket", "polling"],
  pingInterval: 10000,
  pingTimeout: 5000,
});

// Socket.io middleware and handlers
io.use(authenticateSocket);
app.set("socketio", io);
initialize(io);
setupSocketHandlers(io);

// Public routes
app.use("/api/auth", authRoutes);

// Authenticated routes
app.use("/api/users", authenticate, userRoutes);
app.use("/api/appointments", authenticate, appointmentRoutes);
app.use("/api/health-records", authenticate, healthRoutes);
app.use("/api/emergency", authenticate, emergencyRoutes);
app.use("/api/notifications", authenticate, notificationRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/geo", georoutes);
app.use("/api", entryRoutes);
app.use("/api/ambulance-requests", ambulanceRoutes(io));
app.use("/api/healthdata", healthRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/provider-dashboard", healthproviderdashboardRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/supports", supportRoutes);
app.use("/api/alerts", alertRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`Docs available at /api/docs`);
});
// io.on("connection", (socket) => {
//   console.log("back Client connected:", socket.id);
// });
// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received: Closing server");
  httpServer.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

module.exports = app;
