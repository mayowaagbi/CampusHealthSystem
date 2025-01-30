const express = require("express");
const { UserController } = require("../controllers");
const { authenticate, authorize } = require("../middleware");
const { validateRequest } = require("../middleware");
const { updateProfileSchema } = require("../validations");

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
