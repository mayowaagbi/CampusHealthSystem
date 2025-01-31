const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const GeoController = require("../controllers/geoController");
const { validateRequest } = require("../validations/geoValidation");

const router = express.Router();

router.post(
  "/track",
  authMiddleware,
  validateRequest,
  GeoController.trackLocation
);

module.exports = router;
