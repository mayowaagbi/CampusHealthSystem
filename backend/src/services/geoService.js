const geoModel = require("../models/geoModel");
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
}

module.exports = new GeoService();
