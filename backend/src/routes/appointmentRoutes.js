const express = require("express");
const AppointmentController = require("../controllers/appointmentController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createAppointmentSchema,
} = require("../validations/appointmentValidation");

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new appointment (only for students)
router.post("/", authorize("STUDENT"), AppointmentController.createAppointment);

router.get(
  "/",
  authenticate,
  authorize("STUDENT"),
  AppointmentController.getAppointments
);
// Fetch appointment details (only for students)
router.get(
  "/",
  authorize("STUDENT"), // Ensure only students can fetch their appointment details
  AppointmentController.getAppointmentDetails
);

// Cancel an appointment (only for students)
router.delete(
  "/:id/cancel",
  authorize("STUDENT"), // Ensure only students can cancel their appointments
  AppointmentController.deleteAppointment
);

router.patch(
  "/:id/reschedule",
  authorize("STUDENT"),
  // validateRequest(rescheduleAppointmentSchema),
  AppointmentController.rescheduleAppointment
);

module.exports = router;
