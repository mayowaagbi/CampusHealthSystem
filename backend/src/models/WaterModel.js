const BaseModel = require("./BaseModel");

class WaterModel extends BaseModel {
  constructor() {
    // Ensure the model name exactly matches the model in your Prisma schema.
    super("waterGoal");
  }

  // Instance method to add water intake (in milliliters)
  async addIntake(userId, amount) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0); // Set to start of the day

    return this.prisma.waterGoal.upsert({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
      update: {
        current: {
          increment: amount,
        },
      },
      create: {
        userId,
        current: amount,
        date: today,
      },
    });
  }

  // Instance method to get the current progress (water intake) for today
  async getProgress(userId) {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    return this.prisma.waterGoal.findUnique({
      where: {
        userId_date: {
          userId,
          date: today,
        },
      },
    });
  }
  async getWaterByDate(userId, date) {
    console.log(`Fetching water intake for ${userId} on ${date}`);
    try {
      return await this.prisma.waterGoal.findUnique({
        where: {
          userId_date: {
            userId,
            date: new Date(date.setUTCHours(0, 0, 0, 0)),
          },
        },
      });
    } catch (error) {
      console.error("Error in getWaterByDate:", error);
      throw error;
    }
  }
}

module.exports = new WaterModel();
