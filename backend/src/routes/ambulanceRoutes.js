const express = require("express");
const AmbulanceController = require("../controllers/AmbulanceController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply authentication middleware
router.use(authenticate);

// Routes
router.post("/request", AmbulanceController.createRequest);
router.put("/request/:id", AmbulanceController.updateRequest);
router.get("/requests", AmbulanceController.getRequests);

module.exports = router;
