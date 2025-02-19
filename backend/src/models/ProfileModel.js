// // src/models/ProfileModel.js
// const BaseModel = require("./BaseModel");

// class ProfileModel extends BaseModel {
//   constructor() {
//     super("profile");
//   }

//   async findByUserId(userId) {
//     return this.prisma.profile.findUnique({
//       where: { userId },
//       include: {
//         emergencyContacts: true,
//         studentDetails: true,
//       },
//     });
//   }

//   async updateProfile(userId, data) {
//     return this.prisma.profile.update({
//       where: { userId },
//       data,
//       include: { emergencyContacts: true },
//     });
//   }

//   async createProfile(data) {
//     return this.prisma.profile.create({
//       data,
//       include: { emergencyContacts: true },
//     });
//   }
// }

// module.exports = ProfileModel;
// src/models/Profile.js
const BaseModel = require("./BaseModel");

class Profile extends BaseModel {
  constructor() {
    super("profile");
  }

  async findByUserId(userId) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: { emergencyContacts: true },
    });
  }

  async updateProfile(userId, data) {
    return this.prisma.profile.update({
      where: { userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        bloodType: data.bloodType,
        allergies: data.allergies,
        notifyEmail: data.notifyEmail,
        notifySms: data.notifySms,
        notifyPush: data.notifyPush,
        emergencyContacts: {
          updateMany:
            data.emergencyContacts
              ?.filter((contact) => contact.id && contact.relationship) // Ensure valid IDs and relationships
              .map((contact) => ({
                where: { id: contact.id },
                data: {
                  name: contact.name,
                  phone: contact.phone,
                  relationship: contact.relationship,
                },
              })) || [],
          create:
            data.emergencyContacts
              ?.filter((contact) => !contact.id && contact.relationship) // Ensure new contacts have relationships
              .map((contact) => ({
                name: contact.name,
                phone: contact.phone,
                relationship: contact.relationship || "Unknown", // Provide a default value if missing
              })) || [],
        },
        user: {
          update: {
            email: data.email,
          },
        },
      },
      include: {
        emergencyContacts: true,
      },
    });
  }
}

module.exports = Profile;
