// // src/routes/profileRoutes.js
const express = require("express");
const ProfileController = require("../controllers/ProfileController");
const { authenticate } = require("../middleware/authMiddleware");
const { validateProfile } = require("../validations/profileValidator");

const router = express.Router();
const profileController = new ProfileController();

router.use(authenticate);

router.get("/", profileController.getProfile.bind(profileController));
router.put(
  "/",
  validateProfile,
  profileController.updateProfile.bind(profileController)
);

module.exports = router;
