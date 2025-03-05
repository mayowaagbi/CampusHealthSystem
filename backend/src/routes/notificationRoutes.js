// const express = require("express");
// const NotificationController = require("../controllers/notificationController");
// const { authenticate, authorize } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.use(authenticate);

// router.get("/", NotificationController.getNotifications);
// router.patch("/mark-read", NotificationController.markAsRead);

// // Admin-only notification broadcast
// router.post(
//   "/broadcast",
//   authorize("ADMIN"),
//   NotificationController.sendNotification
// );

// module.exports = router;
// src/routes/notificationRoutes.js
const express = require("express");
const router = express.Router();
const NotificationController = require("../controllers/NotificationController");
const { authorize, authenticate } = require("../middleware/authMiddleware");

const controller = new NotificationController();
router.use(authenticate);

// Provider routes
router.post("/", authorize(["PROVIDER"]), controller.createNotification);

// User routes
router.get("/", authorize(["STUDENT"]), controller.getNotifications);
router.patch("/:id/read", authorize(["STUDENT"]), controller.markAsRead);
router.delete("/:id", authorize(["STUDENT"]), controller.deleteNotification);

module.exports = router;
