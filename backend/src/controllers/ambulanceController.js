const AmbulanceService = require("../services/AmbulanceService");
const UserModel = require("../models/User");
const activeRequests = new Map(); // Track active requests and their intervals

class AmbulanceController {
  /**
   * Create a new ambulance request and broadcast it to healthcare providers.
   */
  async createRequest(req, res, io) {
    try {
      const userId = req.user.id;
      const { latitude, longitude, address } = req.body;

      // Create the ambulance request
      const request = await AmbulanceService.createRequest({
        userId,
        latitude,
        longitude,
        address,
      });

      // Fetch all healthcare providers
      const providers = await UserModel.getAllProviders();

      // Broadcast the request to healthcare providers
      console.log("Broadcasting ambulance request to healthcare providers");
      providers.forEach((provider) => {
        if (provider.id) {
          console.log(`Broadcasting to provider ${provider.id}`);
          io.to("healthcare-providers").emit("new-ambulance-request", request);
        }
      });

      // Start sending repeated notifications every 60 seconds
      const intervalId = setInterval(() => {
        console.log("Emitting new-ambulance-request to healthcare-providers");
        io.to("healthcare-providers").emit("new-ambulance-request", request);
      }, 60000); // Send every 60 seconds

      // Track the active request and its interval
      activeRequests.set(request.id, intervalId);

      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating ambulance request:", error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all ambulance requests for the logged-in user.
   */
  async getUserRequests(req, res) {
    try {
      const userId = req.user.id;
      const requests = await AmbulanceService.getUserRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching user ambulance requests:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all ambulance requests (for healthcare providers).
   */
  async getallAmbulanceRequests(req, res) {
    try {
      const requests = await AmbulanceService.getallAmbulanceRequests();
      res.json(requests);
    } catch (error) {
      console.error("Error fetching all ambulance requests:", error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Resolve an ambulance request and stop repeated notifications.
   */
  async resolveRequest(req, res, io) {
    try {
      const { id } = req.params;

      // Update the request status in the database
      const updatedRequest = await AmbulanceService.updateRequestStatus(
        id,
        "DISPATCHED"
      );

      // Stop the repeated notifications
      const intervalId = activeRequests.get(id);
      if (intervalId) {
        clearInterval(intervalId);
        activeRequests.delete(id);
      }

      res.status(200).json(updatedRequest);
    } catch (error) {
      console.error("Error resolving ambulance request:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new AmbulanceController();
