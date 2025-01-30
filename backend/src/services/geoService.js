// services/geoService.js
import { calculateDistance, metersToSteps } from "../utils/geolocation";

class GeoService {
  async processLocation(userId, location) {
    // Get previous location
    const prevLocation = await prisma.userLocation.findFirst({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });

    // Save new location
    const newLocation = await prisma.userLocation.create({
      data: {
        userId,
        latitude: location.lat,
        longitude: location.lng,
      },
    });

    // Calculate steps if previous location exists
    if (prevLocation) {
      const distance = calculateDistance(
        { latitude: prevLocation.latitude, longitude: prevLocation.longitude },
        { latitude: location.lat, longitude: location.lng }
      );

      const steps = metersToSteps(distance);
      await this.updateStepEntry(userId, steps);
    }

    return newLocation;
  }

  async updateStepEntry(userId, steps) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return prisma.stepEntry.upsert({
      where: { userId_date: { userId, date: today } },
      update: { steps: { increment: steps } },
      create: { userId, steps, source: "GEO" },
    });
  }
}

export default new GeoService();
