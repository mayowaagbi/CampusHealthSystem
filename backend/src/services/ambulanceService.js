const AmbulanceModel = require("../models/AmbulanceModel");
const { reverseGeocode } = require("../utils/geocoding"); // Optional geocoding service

class AmbulanceService {
  static async createRequest({ userId, latitude, longitude, address }) {
    try {
      // Optional: Get human-readable address from coordinates
      const locationAddress =
        address || (await reverseGeocode(latitude, longitude));

      return AmbulanceModel.createRequest({
        userId,
        latitude,
        longitude,
        address: locationAddress,
      });
    } catch (error) {
      throw new Error(`Failed to create ambulance request: ${error.message}`);
    }
  }

  static async getUserRequests(userId) {
    try {
      return AmbulanceModel.getRequestsByUser(userId);
    } catch (error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    }
  }
}

module.exports = AmbulanceService;
