import express from "express";
import { AppointmentController } from "../controllers";
import { authenticate, validateRequest } from "../middleware";
import { createAppointmentSchema } from "../validations";

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
