import { EmergencyService } from "../services";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";

class EmergencyController {
  triggerEmergency = asyncHandler(async (req, res) => {
    const result = await EmergencyService.triggerEmergencyAlert(
      req.user.id,
      req.body.location
    );
    successResponse(res, result);
  });

  getEmergencyContacts = asyncHandler(async (req, res) => {
    const contacts = await EmergencyService.getEmergencyContacts(req.user.id);
    successResponse(res, contacts);
  });

  addEmergencyContact = asyncHandler(async (req, res) => {
    const contact = await EmergencyService.addEmergencyContact(
      req.user.id,
      req.body
    );
    successResponse(res, contact, 201);
  });
}

export default new EmergencyController();
