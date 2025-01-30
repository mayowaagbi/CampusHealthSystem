import { Appointment, ProviderDetails } from "../models";
import { sendEmail } from "../utils/mailer";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

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

export default new AppointmentService();
