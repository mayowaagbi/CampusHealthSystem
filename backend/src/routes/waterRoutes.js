const express = require("express");
const router = express.Router();
const WaterController = require("../controllers/WaterController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate); // Protect all routes below

// Set water intake goal
router.post("/goal", WaterController.setGoal);

// Add water intake
router.post("/intake", WaterController.addIntake);

// Get water intake progress
router.get("/progress", WaterController.getProgress);

module.exports = router;
