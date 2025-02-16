const express = require("express");
const router = express.Router();
const AmbulanceController = require("../controllers/AmbulanceController");
const { authenticate } = require("../middleware/authMiddleware");

router.use(authenticate);

router.post("/", AmbulanceController.createRequest);
router.get("/", AmbulanceController.getRequests);

module.exports = router;
