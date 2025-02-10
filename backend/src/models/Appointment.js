const BaseModel = require("./BaseModel");

class Appointment extends BaseModel {
  constructor() {
    super("appointment");
  }

  // Create an appointment request with "PENDING" status by default
  async createAppointment(appointmentData) {
    console.log("Creating appointment:", appointmentData);
    return this.prisma.appointment.create({
      data: {
        studentId: appointmentData.studentId,
        providerId: appointmentData.providerId,
        startTime: new Date(appointmentData.startTime),
        duration: appointmentData.duration,
        service: appointmentData.service,
        status: "PENDING",
        priority: 3,
        notes: appointmentData.notes,
      },
      include: {
        student: { include: { profile: true } },
        provider: { include: { profile: true } },
      },
    });
  }

  async findByStudent(studentId) {
    return this.prisma.appointment.findMany({
      where: { studentId },
      orderBy: { startTime: "asc" },
    });
  }

  // Find appointments by provider ID (for provider's dashboard, pending appointments)
  async findByProvider(providerId) {
    return this.prisma.appointment.findMany({
      where: { providerId },
      include: {
        student: {
          include: {
            profile: true, // Include student profile info
          },
        },
      },
    });
  }

  // Update the status of an appointment (used for provider approval/denial)
  async updateStatus(id, newStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  // Fetch a single appointment by ID
  async findById(appointmentId) {
    return this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        student: true,
        provider: true,
      },
    });
  }

  // Find pending appointments (for provider to approve or deny)
  async findPendingAppointments(providerId) {
    return this.prisma.appointment.findMany({
      where: {
        providerId,
        status: "PENDING", // Only fetch pending appointments
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  // Cancel an appointment
  async cancelAppointment(appointmentId) {
    return this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELED" },
    });
  }
  static async findStudentByUserId(userId) {
    try {
      console.log("Searching for student with userId:", userId);

      // Find the profile associated with the user
      const profile = await prisma.profile.findUnique({
        where: { userId: userId },
        select: { id: true },
      });

      if (!profile) {
        throw new Error(`No profile found for userId: ${userId}`);
      }

      // Find the student associated with the profile
      const student = await prisma.studentDetails.findUnique({
        where: { profileId: profile.id },
      });

      if (!student) {
        throw new Error(`No student found for profileId: ${profile.id}`);
      }

      return student;
    } catch (error) {
      console.error("Error in findStudentByUserId:", error);
      throw new Error("Failed to find student by userId");
    }
  }
}

module.exports = new Appointment();
