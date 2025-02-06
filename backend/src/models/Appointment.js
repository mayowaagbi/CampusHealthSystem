const BaseModel = require("./BaseModel");

class Appointment extends BaseModel {
  constructor() {
    super("appointment");
  }

  // Create an appointment request with "PENDING" status by default
  async createAppointment(appointmentData) {
    return this.prisma.appointment.create({
      data: {
        student: { connect: { id: appointmentData.studentId } },
        provider: appointmentData.providerId
          ? { connect: { id: appointmentData.providerId } }
          : undefined, // No provider needed for creation
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        duration: appointmentData.duration,
        service: appointmentData.service,
        status: appointmentData.status || "PENDING", // Default status is "PENDING"
        priority: appointmentData.priority || 3, // Default priority
        location: appointmentData.location,
        notes: appointmentData.notes,
      },
      include: {
        student: true,
        provider: true,
      },
    });
  }

  // Find appointments by student ID
  async findByStudent(studentId) {
    return this.prisma.appointment.findMany({
      where: { studentId },
      include: {
        provider: {
          include: {
            profile: true, // Include provider profile info
          },
        },
      },
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
}

module.exports = new Appointment();
