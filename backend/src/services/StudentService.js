// services/StudentService.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class StudentService {
  async findStudentByUserId(userId) {
    console.log("[StudentService] Initialized");
    // console.log("Prisma instance:", prisma);
    try {
      console.log("Searching for student with userId:", userId);

      // Find the profile associated with the user
      const profile = await prisma.profile.findUnique({
        where: { userId: userId },
        select: { id: true },
      });

      if (!profile) throw new Error("Profile not found");

      // Find the student associated with the profile
      const student = await prisma.studentDetails.findUnique({
        where: { profileId: profile.id },
      });

      if (!student)
        throw new Error(`No student found for profileId: ${profile.id}`);

      return student;
    } catch (error) {
      console.error("StudentService Error:", error);
      throw new Error("Failed to find student");
    }
  }
}

module.exports = new StudentService();
