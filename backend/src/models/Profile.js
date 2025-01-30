const BaseModel = require("./BaseModel");

class Profile extends BaseModel {
  constructor() {
    super("profile");
  }

  async findByUserId(userId) {
    return this.prisma.profile.findUnique({
      where: { userId },
      include: {
        studentDetails: true,
        providerDetails: true,
        emergencyContacts: true,
      },
    });
  }

  async updateByUserId(userId, data) {
    return this.prisma.profile.update({
      where: { userId },
      data,
    });
  }

  async createEmergencyContact(userId, contactData) {
    return this.prisma.emergencyContact.create({
      data: {
        profile: { connect: { userId } },
        ...contactData,
      },
    });
  }
}

module.exports = new Profile();
