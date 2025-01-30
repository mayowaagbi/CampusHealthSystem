const { UserService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateRequest } = require("../middleware/validationMiddleware");
const { updateProfileSchema } = require("../validations/userValidation");

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
