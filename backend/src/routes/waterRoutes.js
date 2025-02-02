const express = require("express");
const router = express.Router();
const WaterController = require("../controllers/WaterController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate); // Protect all routes below

router.post("/goal", WaterController.setGoal); // Set water intake goal
router.post("/intake", WaterController.addIntake); // Add water intake
router.get("/progress", WaterController.getProgress); // Get progress

module.exports = router;
