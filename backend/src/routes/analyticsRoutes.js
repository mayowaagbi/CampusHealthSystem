const express = require("express");
const { AnalyticsController } = require("../controllers");
const { authenticate, authorize } = require("../middleware");

const router = express.Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/appointments", AnalyticsController.getAppointmentAnalytics);
router.get("/health-trends", AnalyticsController.getHealthTrends);
router.get("/system-usage", AnalyticsController.getSystemUsage);

export default router;
