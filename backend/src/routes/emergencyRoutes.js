const express = require("express");
const { EmergencyController } = require("../controllers/emergencyController");
const {
  authenticate,
  validateRequest,
} = require("../middleware/authMiddleware");
const {
  emergencyContactSchema,
} = require("../validations/emergencyValidation");

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
