// // src/controllers/ProfileController.js
// const ProfileService = require("../services/ProfileService");

// class ProfileController {
//   constructor() {
//     this.profileService = new ProfileService();
//   }

//   // async getProfile(req, res) {
//     try {
//       const profile = await this.profileService.getProfile(req.user.id);
//       res.json(profile);
//     } catch (error) {
//       res.status(404).json({ error: error.message });
//     }
//   }

//   async updateProfile(req, res) {
//     try {
//       const updatedProfile = await this.profileService.updateProfile(
//         req.user.id,
//         req.body
//       );
//       res.json(updatedProfile);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   }
// }

// module.exports = ProfileController;
// src/controllers/ProfileController.js
const ProfileService = require("../services/ProfileService");

class ProfileController {
  constructor() {
    this.profileService = new ProfileService();
  }

  async getProfile(req, res) {
    try {
      const profile = await this.profileService.getProfile(req.user.id);
      res.json(profile);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const updatedProfile = await this.profileService.updateProfile(
        req.user.id,
        req.body
      );
      res.json(updatedProfile);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProfileController;
