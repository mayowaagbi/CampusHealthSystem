const { PrismaClient } = require("@prisma/client");

class AnalyticsService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAppointmentStats(period) {
    return this.prisma.appointment.aggregate([
      { $match: { createdAt: { $gte: period.start } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          averageDuration: { $avg: "$duration" },
        },
      },
    ]);
  }
  async getHealthTrends() {
    return this.prisma.healthRecord.aggregate([
      {
        $group: {
          _id: "$diagnosis",
          count: { $sum: 1 },
          latest: { $max: "$recordedAt" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
  }
}

module.exports = new AnalyticsService();
