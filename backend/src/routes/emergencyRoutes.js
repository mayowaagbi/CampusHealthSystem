const express = require("express");
const { EmergencyController } = require("../controllers");
const { authenticate, validateRequest } = require("../middleware");
const { emergencyContactSchema } = require("../validations");

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
