import express from "express";
import { HealthRecordController } from "../controllers";
import { authenticate, validateRequest } from "../middleware";
import { createHealthRecordSchema } from "../validations";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.use(authenticate);

router.post(
  "/",
  validateRequest(createHealthRecordSchema),
  HealthRecordController.createRecord
);
router.get("/", HealthRecordController.getRecords);
router.post(
  "/:recordId/documents",
  upload.single("file"),
  HealthRecordController.uploadDocument
);

export default router;
