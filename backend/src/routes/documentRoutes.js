const express = require("express");
const multer = require("../config/multer");
const {
  uploadDocument,
  getDocuments,
  downloadDocument,
  deleteDocument,
  getAllRecords,
} = require("../controllers/documentController"); // Import correctly
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Upload route with proper middleware order
router.post(
  "/upload",
  multer.single("document"), // Multer first
  authenticate, // Authentication second
  uploadDocument
);

// Apply authentication to other routes
router.use(authenticate);
router.get("/", getDocuments);
router.get("/download/:documentId", downloadDocument);
router.delete("/:documentId", deleteDocument);
router.get("/all", authorize("ADMIN", "PROVIDER"), getAllRecords);

module.exports = router;
