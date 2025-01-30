const express = require("express");
const { AppointmentController } = require("../controllers");
const { authenticate, validateRequest } = require("../middleware");
const { createAppointmentSchema } = require("../validations");

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

export default router;
