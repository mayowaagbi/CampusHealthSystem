const BaseModel = require("./BaseModel");

class Appointment extends BaseModel {
  constructor() {
    super("appointment");
  }

  async createAppointment(appointmentData) {
    return this.prisma.appointment.create({
      data: {
        student: { connect: { id: appointmentData.studentId } },
        provider: { connect: { id: appointmentData.providerId } },
        startTime: appointmentData.startTime,
        endTime: appointmentData.endTime,
        duration: appointmentData.duration,
        status: appointmentData.status || "PENDING",
        priority: appointmentData.priority || 3,
        location: appointmentData.location,
        videoLink: appointmentData.videoLink,
        notes: appointmentData.notes,
      },
      include: {
        student: true,
        provider: true,
      },
    });
  }

  async findByStudent(studentId) {
    return this.prisma.appointment.findMany({
      where: { studentId },
      include: {
        provider: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async findByProvider(providerId) {
    return this.prisma.appointment.findMany({
      where: { providerId },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
    });
  }

  async updateStatus(id, newStatus) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: newStatus },
    });
  }
}

module.exports = new Appointment();
