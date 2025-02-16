const AmbulanceService = require("../services/AmbulanceService");

class AmbulanceController {
  static async createRequest(req, res) {
    try {
      const userId = req.user.id;
      const { latitude, longitude, address } = req.body;

      const request = await AmbulanceService.createRequest({
        userId,
        latitude,
        longitude,
        address,
      });

      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating ambulance request:", error);
      res.status(400).json({ error: error.message });
    }
  }

  static async getRequests(req, res) {
    try {
      const userId = req.user.id;
      const requests = await AmbulanceService.getUserRequests(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching ambulance requests:", error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AmbulanceController;
