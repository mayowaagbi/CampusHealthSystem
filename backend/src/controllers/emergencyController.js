const { EmergencyService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { asyncHandler } = require("../utils/asyncHandler");

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

module.export = new EmergencyController();
