import express from "express";
import { AnalyticsController } from "../controllers";
import { authenticate, authorize } from "../middleware";

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/appointments", AnalyticsController.getAppointmentAnalytics);
router.get("/health-trends", AnalyticsController.getHealthTrends);
router.get("/system-usage", AnalyticsController.getSystemUsage);

export default router;
