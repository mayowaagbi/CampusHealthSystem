// services/AlertService.js
const AlertModel = require("../models/AlertModel");

class AlertService {
  async activeAlerts(providerId) {
    return AlertModel.activeAlerts(providerId);
  }
}

module.exports = new AlertService();
