import express from "express";
import { AuthController } from "../controllers";
import { validateRequest } from "../middleware";
import { loginSchema, registerSchema } from "../validations";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  AuthController.register
);
router.post("/login", validateRequest(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

export default router;
