const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const healthRecordRoutes = require("./healthRecordRoutes");
const notificationRoutes = require("./notificationRoutes");
const emergencyRoutes = require("./emergencyRoutes");
const analyticsRoutes = require("./analyticsRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/health-records", healthRecordRoutes);
router.use("/notifications", notificationRoutes);
router.use("/emergency", emergencyRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
