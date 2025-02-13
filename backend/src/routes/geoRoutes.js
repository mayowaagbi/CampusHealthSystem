const express = require("express");
const geoController = require("../controllers/geoController");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/track", rateLimiter, geoController.processLocation);

module.exports = router;
