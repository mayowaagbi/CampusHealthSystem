const { Appointment, ProviderDetails, User } = require("../models");
const { sendEmail } = require("../utils/mailer");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");

class AppointmentService {
  async createAppointment(studentId, providerId, appointmentData) {
    const provider = await ProviderDetails.findById(providerId);
    if (!provider.available) {
      throw new ApiError(400, "Provider not available");
    }

    const appointment = await Appointment.create({
      ...appointmentData,
      studentId,
      providerId,
    });

    await this._sendAppointmentConfirmation(appointment);
    return appointment;
  }

  async _sendAppointmentConfirmation(appointment) {
    try {
      const [student, provider] = await Promise.all([
        User.findById(appointment.studentId),
        User.findById(appointment.providerId),
      ]);

      await sendEmail(
        student.email,
        "Appointment Confirmed",
        `Your appointment with ${provider.name} is confirmed`
      );
    } catch (error) {
      logger.error("Failed to send appointment confirmation", error);
    }
  }
}

module.export = new AppointmentService();
