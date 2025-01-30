const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("user");
  }

  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async createWithProfile(userData) {
    return this.prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: userData.passwordHash,
        role: userData.role,
        profile: {
          create: {
            firstName: userData.profile.firstName,
            lastName: userData.profile.lastName,
            dateOfBirth: userData.profile.dateOfBirth,
            phone: userData.profile.phone,
            avatar: userData.profile.avatar,
            bio: userData.profile.bio,
          },
        },
      },
      include: { profile: true },
    });
  }

  async getFullUser(id) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            studentDetails: true,
            providerDetails: true,
            emergencyContacts: true,
          },
        },
        sessions: true,
        notifications: true,
      },
    });
  }
}

module.exports = new User();
