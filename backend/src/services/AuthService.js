const { User } = require("../models");
const { comparePassword } = require("../utils/hash");
const { generateTokens } = require("../utils/tokenService");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");

class AuthService {
  async register(userData) {
    const user = await User.create(userData);
    logger.info(`User registered: ${user.id}`);
    return user;
  }

  async login(email, password) {
    const user = await User.findByEmail(email);
    if (!user || !(await comparePassword(password, user.passwordHash))) {
      throw new ApiError(401, "Invalid credentials");
    }

    const tokens = generateTokens({ id: user.id, role: user.role });
    logger.info(`User logged in: ${user.id}`);
    return { user, tokens };
  }

  async refreshToken(refreshToken) {
    try {
      const { id } = verifyToken(refreshToken, "refresh");
      const user = await User.findById(id);
      return generateTokens({ id: user.id, role: user.role });
    } catch (error) {
      throw new ApiError(401, "Invalid refresh token");
    }
  }
}

export default new AuthService();
