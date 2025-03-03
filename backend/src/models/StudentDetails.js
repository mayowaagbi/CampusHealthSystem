const BaseModel = require("./BaseModel");

class StudentDetails extends BaseModel {
  constructor() {
    super("studentDetails");
  }

  /**
   * Get complete student profile with health records and appointments
   */
  async getFullStudentProfile(studentId) {
    return this.prisma.studentDetails.findUnique({
      where: { studentId },
      include: {
        profile: true,
        healthRecords: {
          include: {
            prescriptions: true,
            documents: true,
          },
        },
        appointments: {
          include: {
            provider: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Update student insurance information
   */
  async updateInsuranceInfo(studentId, insuranceNumber) {
    return this.prisma.studentDetails.update({
      where: { studentId },
      data: { insuranceNumber },
    });
  }

  /**
   * Count students by provider
   */
  async countByProvider(providerId) {
    return this.prisma.studentDetails.count({
      where: { primaryCareProviderId: providerId },
    });
  }

  /**
   * Get list of students based on search and status
   */
  async getStudentsFromDB(search, status) {
    return this.prisma.studentDetails.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { studentId: { contains: search, mode: "insensitive" } },
                  {
                    insuranceNumber: { contains: search, mode: "insensitive" },
                  },
                  {
                    profile: {
                      OR: [
                        {
                          firstName: { contains: search, mode: "insensitive" },
                        },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                      ],
                    },
                  },
                ],
              }
            : {},
          status !== "all"
            ? {
                OR: [
                  {
                    alerts: {
                      some: {
                        status: "ACTIVE",
                        priority: status === "CRITICAL" ? "HIGH" : undefined,
                      },
                    },
                  },
                  { appointments: { some: { status } } },
                ],
              }
            : {},
        ],
      },
      include: {
        profile: true,
        alerts: { orderBy: { createdAt: "desc" }, take: 5 },
        appointments: { orderBy: { startTime: "desc" }, take: 1 },
        medicalDocuments: { orderBy: { uploadedAt: "desc" }, take: 5 },
      },
      orderBy: { profile: { lastName: "asc" } },
    });
  }
  async getUserIdByStudentId(studentId) {
    try {
      // Fetch StudentDetails with included Profile
      const studentDetails = await this.prisma.studentDetails.findUnique({
        where: { id: studentId },
        include: {
          profile: {
            select: { userId: true }, // Only select the userId from Profile
          },
        },
      });

      if (!studentDetails) {
        throw new Error("Student details not found");
      }

      if (!studentDetails.profile) {
        throw new Error("Associated profile not found");
      }

      // Return the userId from the Profile
      return studentDetails.profile.userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      throw new Error(`Failed to retrieve user ID: ${error.message}`);
    }
  }
}

module.exports = new StudentDetails();
