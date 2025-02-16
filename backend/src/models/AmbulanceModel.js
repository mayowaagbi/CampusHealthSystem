const BaseModel = require("./BaseModel");

class AmbulanceModel extends BaseModel {
  constructor() {
    super("ambulanceRequest");
  }

  async createRequest(data) {
    return this.prisma.ambulanceRequest.create({
      data: {
        ...data,
        status: "PENDING", // Default status
      },
    });
  }

  async getRequestsByUser(userId) {
    return this.prisma.ambulanceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new AmbulanceModel();
