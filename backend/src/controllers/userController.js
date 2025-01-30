import { UserService } from "../services";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware/validationMiddleware";
import { updateProfileSchema } from "../validations/userValidation";

class UserController {
  getProfile = asyncHandler(async (req, res) => {
    const user = await UserService.getUserProfile(req.user.id);
    successResponse(res, user);
  });

  updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await UserService.updateProfile(req.user.id, req.body);
    successResponse(res, updatedUser);
  });

  deleteAccount = asyncHandler(async (req, res) => {
    await UserService.deactivateUser(req.user.id);
    successResponse(res, { message: "Account deactivated successfully" });
  });
}

export default new UserController();
