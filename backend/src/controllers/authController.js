import { AuthService } from "../services";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware/validationMiddleware";
import { loginSchema, registerSchema } from "../validations/authValidation";

class AuthController {
  register = asyncHandler(async (req, res) => {
    const userData = await AuthService.registerUser(req.body);
    successResponse(res, userData, 201);
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, tokens } = await AuthService.login(email, password);
    successResponse(res, { user, tokens });
  });

  refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const tokens = await AuthService.refreshToken(refreshToken);
    successResponse(res, { tokens });
  });

  logout = asyncHandler(async (req, res) => {
    await AuthService.logout(req.user.id);
    successResponse(res, { message: "Successfully logged out" });
  });
}

export default new AuthController();
