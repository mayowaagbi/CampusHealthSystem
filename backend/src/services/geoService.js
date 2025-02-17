const geoModel = require("../models/geoModel");
const UserModel = require("../models/User");
const { calculateDistance, metersToSteps } = require("../utils/geolocation");

class GeoService {
  async processLocation(userId, location) {
    console.log("Processing location for user:", userId, location);

    if (!userId || !location.lat || !location.lng) {
      throw new Error("Invalid input parameters");
    }

    const prevLocation = await geoModel.getPreviousLocation(userId);
    console.log("Previous location:", prevLocation);

    const newLocation = await geoModel.saveNewLocation(userId, location);
    console.log("New location saved:", newLocation);

    let stepsAdded = 0;
    let totalSteps = 0;

    if (prevLocation) {
      const distance = calculateDistance(
        { latitude: prevLocation.latitude, longitude: prevLocation.longitude },
        { latitude: location.lat, longitude: location.lng }
      );
      console.log("Distance calculated:", distance);

      if (distance >= 5) {
        stepsAdded = metersToSteps(distance);
        totalSteps = (await geoModel.upsertStepEntry(userId, stepsAdded)).steps;
        console.log("Steps added:", stepsAdded);
        console.log("Total steps:", totalSteps);
      }
    }

    return { stepsAdded, totalSteps, location: newLocation };
  }
  // static async getProgress(userId) {
  //   // Get step goal from user profile
  //   const user = await UserModel.findById(userId);
  //   const target = user.stepGoal || 0;

  //   // Get current steps (today's steps)
  //   const today = new Date();
  //   today.setUTCHours(0, 0, 0, 0);
  //   const stepsEntry = await GeoModel.getStepsByDate(userId, today);
  //   const current = stepsEntry?.steps || 0;

  //   // Calculate progress percentage
  //   const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

  //   return { current, target, progress };
  // }
  async getProgress(userId) {
    try {
      console.log(`Fetching step progress for user: ${userId}`);

      // Get step goal from user profile
      const user = await UserModel.findById(userId);
      if (!user) {
        console.error(`User not found: ${userId}`);
        throw new Error("User not found");
      }

      const target = user.stepGoal || MIN_STEPS;
      console.log(`Step goal for user ${userId}: ${target}`);

      // Get current steps
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      console.log(`Fetching steps for date: ${today.toISOString()}`);

      const stepsEntry = await geoModel.getStepsByDate(userId, today);
      console.log(`Steps entry: ${JSON.stringify(stepsEntry)}`);

      const current = stepsEntry?.steps || 0;
      console.log(`Current steps: ${current}`);

      // Calculate progress
      const progress = target > 0 ? Math.min((current / target) * 100, 100) : 0;

      return { current, target, progress };
    } catch (error) {
      console.error(`Error in GeoService.getProgress: ${error.message}`);
      console.error(error.stack); // Log the full stack trace
      throw new Error("Failed to fetch step progress");
    }
  }
}

module.exports = new GeoService();
