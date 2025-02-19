// src/services/ProfileService.js
const { Profile } = require("../models");

class ProfileService {
  constructor() {
    this.profileModel = new Profile();
  }

  async getProfile(userId) {
    const profile = await this.profileModel.findByUserId(userId);
    if (!profile) throw new Error("Profile not found");
    return profile;
  }

  async updateProfile(userId, data) {
    return this.profileModel.updateProfile(userId, data);
  }
}

module.exports = ProfileService;
