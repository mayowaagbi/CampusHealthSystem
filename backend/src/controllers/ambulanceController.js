import { AmbulanceService } from "../services";
import { asyncHandler } from "../utils/asyncHandler";
import { validateRequest } from "../middleware";
import { ambulanceRequestSchema } from "../validations";

class AmbulanceController {
  createRequest = asyncHandler(async (req, res) => {
    const { latitude, longitude, address } = ambulanceRequestSchema.parse(
      req.body
    );

    const request = await AmbulanceService.createRequest({
      userId: req.user.id,
      latitude,
      longitude,
      address,
    });

    // Trigger emergency notifications
    await AmbulanceService.notifyEmergencyServices(request);

    res.status(201).json(request);
  });

  updateRequest = asyncHandler(async (req, res) => {
    const updated = await AmbulanceService.updateRequest(
      req.params.id,
      req.body.status
    );
    res.json(updated);
  });

  getRequests = asyncHandler(async (req, res) => {
    const requests = await AmbulanceService.getUserRequests(req.user.id);
    res.json(requests);
  });
}

export default new AmbulanceController();
