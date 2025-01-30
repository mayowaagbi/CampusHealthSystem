const express = require("express");
const { HealthRecordController } = require("../controllers");
const { authenticate, validateRequest } = require("../middleware");
const { createHealthRecordSchema } = require("../validations");
const multer = require("multer");

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
