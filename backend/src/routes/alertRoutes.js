// src/routes/alertRoutes.ts
const express = require("express");
const alertController = require("../controllers/alertController");
const { authorize, authenticate } = require("../middleware/authMiddleware");

const router = express.Router();
router.use(authenticate);
// Create a new alert
router.post("/", authorize("PROVIDER"), alertController.createAlert);
// router.post("/", authorize("STUDENT"), AppointmentController.createAppointment);

// Get all alerts
router.get("/", authorize("PROVIDER"), alertController.getallAlerts);

// Delete an alert
router.delete("/:id", authorize("PROVIDER"), alertController.deleteAlert);

router.patch(
  "/:id/publish",
  authorize("PROVIDER"),
  alertController.publishAlert
);

module.exports = router;
