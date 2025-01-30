import express from "express";
import { UserController } from "../controllers";
import { authenticate, authorize } from "../middleware";
import { validateRequest } from "../middleware";
import { updateProfileSchema } from "../validations";

const router = express.Router();

router.use(authenticate);

router.get("/me", UserController.getProfile);
router.put(
  "/profile",
  validateRequest(updateProfileSchema),
  UserController.updateProfile
);
router.delete("/", UserController.deleteAccount);

// Admin-only routes
router.get("/", authorize("ADMIN"), UserController.getAllUsers);
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  UserController.updateUserStatus
);

export default router;
