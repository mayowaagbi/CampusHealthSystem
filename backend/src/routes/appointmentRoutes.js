const express = require("express");
const AppointmentController = require("../controllers/appointmentController");
const { authenticate } = require("../middleware/authMiddleware");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createAppointmentSchema,
} = require("../validations/appointmentValidation");

const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validateRequest(createAppointmentSchema),
  AppointmentController.createAppointment
);
router.get("/", AppointmentController.getAppointments);
router.get("/:id", AppointmentController.getAppointmentDetails);
router.patch("/:id/cancel", AppointmentController.cancelAppointment);

module.exports = router;
