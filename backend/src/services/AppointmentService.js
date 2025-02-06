const { Appointment, ProviderDetails, User } = require("../models");
const { sendEmail } = require("../utils/mailer");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");

class AppointmentService {
  // Method to create an appointment request
  async createAppointment(studentId, appointmentData) {
    const provider = await ProviderDetails.findById(appointmentData.providerId);

    // Check if provider exists and is available
    if (!provider || !provider.available) {
      throw new ApiError(400, "Provider not available");
    }

    // Create appointment with "pending" status
    const appointment = await Appointment.create({
      ...appointmentData,
      studentId,
      providerId: appointmentData.providerId,
      status: "pending", // Initial status is "pending"
    });

    // Send a request to the provider's dashboard (this can be handled via internal notifications or fetching it for the provider)
    await this._sendAppointmentRequestToProvider(appointment);

    return appointment;
  }

  // Send the appointment request to the provider for review (internal notification or dashboard update)
  async _sendAppointmentRequestToProvider(appointment) {
    try {
      const provider = await User.findById(appointment.providerId);

      // Here, we're notifying the provider that a new appointment request is awaiting approval
      await sendEmail(
        provider.email,
        "New Appointment Request",
        `You have a new appointment request from a student. Please review and approve or deny.`
      );
    } catch (error) {
      logger.error("Failed to send appointment request to provider", error);
    }
  }

  // Provider can approve or deny the appointment request
  async approveOrDenyAppointment(providerId, appointmentId, decision) {
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }

    // Only the provider assigned to the appointment can approve or deny it
    if (appointment.providerId.toString() !== providerId.toString()) {
      throw new ApiError(
        403,
        "You are not authorized to approve or deny this appointment"
      );
    }

    // Set the status based on the provider's decision
    const status = decision === "approve" ? "approved" : "denied";
    appointment.status = status;
    await appointment.save();

    // Send the result (approved/denied) to the student
    await this._sendAppointmentResultToStudent(appointment);

    return appointment;
  }

  // Send approval/denial result to the student
  async _sendAppointmentResultToStudent(appointment) {
    try {
      const [student, provider] = await Promise.all([
        User.findById(appointment.studentId),
        User.findById(appointment.providerId),
      ]);

      let message = "";
      if (appointment.status === "approved") {
        message = `Your appointment with ${provider.name} has been confirmed.`;
      } else {
        message = `Your appointment with ${provider.name} has been denied.`;
      }

      // Send email notification to the student
      await sendEmail(
        student.email,
        `Appointment ${appointment.status}`,
        message
      );
    } catch (error) {
      logger.error("Failed to send appointment result to student", error);
    }
  }

  // Fetch all pending appointments for the provider (to be shown on the provider's dashboard)
  async getPendingAppointments(providerId) {
    const appointments = await Appointment.find({
      providerId,
      status: "pending",
    });

    return appointments;
  }

  // Fetch an appointment by its ID
  async getAppointmentById(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }
    return appointment;
  }

  // Update an existing appointment
  async updateAppointment(appointmentId, updateData) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }
    Object.assign(appointment, updateData);
    await appointment.save();
    return appointment;
  }

  // Delete an appointment
  async deleteAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }
    await appointment.remove();
    return { message: "Appointment deleted successfully" };
  }

  // Get all appointments (can be used for listing all appointments, if needed)
  async getAppointments() {
    const appointments = await Appointment.find();
    return appointments;
  }

  // Cancel an appointment
  async cancelAppointment(appointmentId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      throw new ApiError(404, "Appointment not found");
    }
    appointment.status = "canceled";
    await appointment.save();
    return { message: "Appointment canceled successfully" };
  }
}

module.exports = new AppointmentService();
