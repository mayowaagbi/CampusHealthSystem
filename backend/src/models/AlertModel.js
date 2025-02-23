// models/AlertModel.js
const BaseModel = require("./BaseModel");

class AlertModel extends BaseModel {
  constructor() {
    super("alert");
  }

  async activeAlerts(providerId) {
    return this.prisma.alert.count({
      where: {
        student: { primaryCareProviderId: providerId },
        status: "ACTIVE",
      },
    });
  }
}

module.exports = new AlertModel();
