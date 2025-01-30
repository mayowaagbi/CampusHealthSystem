import express from "express";
import FileController from "../controllers/fileController";
import { authMiddleware } from "../middleware";

const router = express.Router();

router.use(authMiddleware);

router.post("/upload", FileController.uploadFile);
router.delete("/:id", FileController.deleteFile);

export default router;
