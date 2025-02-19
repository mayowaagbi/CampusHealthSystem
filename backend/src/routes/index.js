const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const appointmentRoutes = require("./appointmentRoutes");
const healthRecordRoutes = require("./healthRecordRoutes");
const notificationRoutes = require("./notificationRoutes");
const emergencyRoutes = require("./emergencyRoutes");
const analyticsRoutes = require("./analyticsRoutes");
const profileRoutes = require("./profileRoutes");
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/health-records", healthRecordRoutes);
router.use("/notifications", notificationRoutes);
router.use("/emergency", emergencyRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/profile", profileRoutes);

module.exports = router;
