const { User, Profile } = require("../models");
const { hashPassword } = require("../utils/hash");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");

class UserService {
  async registerUser({ email, password, role, profileData }) {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw new ApiError(400, "Email already registered");
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.createWithProfile({
      email,
      passwordHash: hashedPassword,
      role,
      profile: profileData,
    });

    logger.info(`New user registered: ${user.id}`);
    return user;
  }

  async updateUserProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const updatedProfile = await Profile.updateByUserId(userId, updateData);
    return updatedProfile;
  }

  async deactivateUser(userId) {
    return User.update(userId, { isActive: false });
  }
}

module.export = new UserService();
