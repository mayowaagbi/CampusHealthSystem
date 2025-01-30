// routes/geoRoutes.js
import express from "express";
import { authMiddleware } from "../middleware";
import GeoController from "../controllers/geoController";
import { validateRequest } from "../validations/geoValidation";

const router = express.Router();

router.post(
  "/track",
  authMiddleware,
  validateRequest,
  GeoController.trackLocation
);

export default router;
