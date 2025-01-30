import express from "express";
import { NotificationController } from "../controllers";
import { authenticate, authorize } from "../middleware";

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
