import express from "express";
import { EmergencyController } from "../controllers";
import { authenticate, validateRequest } from "../middleware";
import { emergencyContactSchema } from "../validations";

const router = express.Router();

router.use(authenticate);

router.post("/trigger", EmergencyController.triggerEmergency);
router.get("/contacts", EmergencyController.getEmergencyContacts);
router.post(
  "/contacts",
  validateRequest(emergencyContactSchema),
  EmergencyController.addEmergencyContact
);

export default router;
