const BaseModel = require("./BaseModel");

class StudentDetails extends BaseModel {
  constructor() {
    super("studentDetails");
  }

  /**
   * Get complete student profile with health records and appointments
   * @param {string} studentId - UUID of the student
   * @returns {Promise<Object>} Complete student profile
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
   * @param {string} studentId - UUID of the student
   * @param {string} insuranceNumber - New insurance number
   * @returns {Promise<Object>} Updated student details
   */
  async updateInsuranceInfo(studentId, insuranceNumber) {
    return this.prisma.studentDetails.update({
      where: { studentId },
      data: { insuranceNumber },
    });
  }
}

module.exports = new StudentDetails();
