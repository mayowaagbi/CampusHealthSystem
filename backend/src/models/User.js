const BaseModel = require("./BaseModel");

class User extends BaseModel {
  constructor() {
    super("user");
  }

  async findByEmail(email) {
    try {
      return await this.model.findUnique({
        where: { email },
        include: { profile: true },
      });
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async createWithProfile(userData) {
    try {
      const userDataToCreate = {
        email: userData.email,
        passwordHash: userData.passwordHash,
        role: userData.role,
      };

      if (userData.profile) {
        userDataToCreate.profile = {
          create: {
            firstName: userData.profile.firstName || null,
            lastName: userData.profile.lastName || null,
            dateOfBirth: new Date(userData.profile.dateOfBirth),
            phone: userData.profile.phone || null,
            avatar: userData.profile.avatar || null,
            bio: userData.profile.bio || null,
          },
        };
      }

      return await this.prisma.user.create({
        data: userDataToCreate,
        include: { profile: true },
      });
    } catch (error) {
      console.error("Error creating user with profile:", error);
      throw error; // Rethrow to handle it further up if necessary
    }
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
