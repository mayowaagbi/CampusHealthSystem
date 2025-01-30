const express = require("express");
const { authMiddleware } = require("../middleware");
const GeoController = require("../controllers/geoController");
const { validateRequest } = require("../validations/geoValidation");

const router = express.Router();

router.post(
  "/track",
  authMiddleware,
  validateRequest,
  GeoController.trackLocation
);

export default router;
