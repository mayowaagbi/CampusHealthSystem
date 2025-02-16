const BaseModel = require("./BaseModel");

class GeoModel extends BaseModel {
  constructor() {
    super("userLocation");
  }

  async getPreviousLocation(userId) {
    return await this.prisma.userLocation.findFirst({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });
  }

  async saveNewLocation(userId, location) {
    return await this.prisma.userLocation.create({
      data: { userId, latitude: location.lat, longitude: location.lng },
    });
  }

  async upsertStepEntry(userId, steps) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return await this.prisma.stepEntry.upsert({
      where: { userId_date: { userId, date: today } },
      update: { steps: { increment: steps } },
      create: { userId, steps, date: today, source: "GEO" },
    });
  }
  async getStepsByDate(userId, date) {
    console.log(`Fetching steps for ${userId} on ${date}`);
    try {
      return await this.prisma.stepEntry.findUnique({
        where: {
          userId_date: {
            userId,
            date: new Date(date.setUTCHours(0, 0, 0, 0)),
          },
        },
      });
    } catch (error) {
      console.error("Error in getStepsByDate:", error);
      throw error;
    }
  }
}

module.exports = new GeoModel();
