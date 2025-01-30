const express = require("express");
const FileController = require("../controllers/fileController");
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/upload", FileController.uploadFile);
router.delete("/:id", FileController.deleteFile);

export default router;
