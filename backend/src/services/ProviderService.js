const providerModel = require("../models/ProviderModel");
class ProviderService {
  async findByUserId(userId) {
    return await providerModel.findByUserId(userId);
  }
}

module.exports = new ProviderService();
