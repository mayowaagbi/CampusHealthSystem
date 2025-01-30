import { User } from "../models";
import { comparePassword } from "../utils/hash";
import { generateTokens } from "../utils/tokenService";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

class AuthService {
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
