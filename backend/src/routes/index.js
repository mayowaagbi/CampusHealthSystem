import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import appointmentRoutes from "./appointmentRoutes";
import healthRecordRoutes from "./healthRecordRoutes";
import notificationRoutes from "./notificationRoutes";
import emergencyRoutes from "./emergencyRoutes";
import analyticsRoutes from "./analyticsRoutes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/health-records", healthRecordRoutes);
router.use("/notifications", notificationRoutes);
router.use("/emergency", emergencyRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
