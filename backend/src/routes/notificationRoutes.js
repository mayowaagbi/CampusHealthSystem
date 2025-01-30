const express = require("express");
const { NotificationController } = require("../controllers");
const { authenticate, authorize } = require("../middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", NotificationController.getNotifications);
router.patch("/mark-read", NotificationController.markAsRead);

// Admin-only notification broadcast
router.post(
  "/broadcast",
  authorize("ADMIN"),
  NotificationController.sendNotification
);

export default router;
