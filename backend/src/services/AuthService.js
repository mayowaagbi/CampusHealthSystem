const User = require("../models/User");
const { comparePassword } = require("../utils/hash");
const { generateTokens, verifyToken } = require("../utils/tokenService");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");
const bcrypt = require("bcrypt");
class AuthService {
  /**
   * Register a new user.
   * @param {Object} userData - User data to register.
   * @returns {Promise<User>} - The newly registered user.
   * @throws {ApiError} - If the email is already in use.
   */
  // async registerUser(userData) {
  //   // Check if user already exists
  //   console.log("User Model:", User);
  //   const existingUser = await User.findByEmail(userData.email);

  //   if (existingUser) {
  //     throw new Error("User already exists with this email");
  //   }

  //   // Proceed with registration logic...
  //   return User.createWithProfile(userData);
  // }
  async registerUser(userData) {
    // Check if user already exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash the password before saving
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(userData.password, saltRounds);

    // Proceed with registration using hashed password
    return User.createWithProfile({
      ...userData,
      passwordHash, // Ensure this is passed as a string
    });
  }
  /**
   * Login user and generate tokens.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {Promise<{ user: User, tokens: Object }>} - User and generated tokens.
   * @throws {ApiError} - If credentials are invalid.
   */
  async login(email, password) {
    try {
      const user = await User.findByEmail(email);

      if (!user) {
        throw new ApiError(401, "Invalid credentials");
      }

      const isPasswordValid = await comparePassword(
        password,
        user.passwordHash
      );
      if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
      }

      const tokens = generateTokens({ id: user.id, role: user.role });
      logger.info(`User logged in: ${user.id}`);
      return { user, tokens };
    } catch (error) {
      logger.error("Login error:", error);
      throw new ApiError(500, "Internal Server Error");
    }
  }

  /**
   * Refresh access token using a refresh token.
   * @param {string} refreshToken - Refresh token.
   * @returns {Promise<Object>} - New access and refresh tokens.
   * @throws {ApiError} - If the refresh token is invalid.
   */
  async refreshToken(refreshToken) {
    try {
      const { id } = verifyToken(refreshToken, "refresh");
      const user = await User.findByPk(id);

      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }

      return generateTokens({ id: user.id, role: user.role });
    } catch (error) {
      logger.error(`Refresh token error: ${error.message}`);
      throw new ApiError(401, "Invalid refresh token");
    }
  }

  /**
   * Logout user (optional functionality).
   * @param {string} userId - User ID to log out.
   * @returns {Promise<void>}
   */
  async logout(userId) {
    // Implement token invalidation logic here if needed (e.g., blacklist tokens).
    logger.info(`User logged out: ${userId}`);
  }
}

module.exports = new AuthService();
