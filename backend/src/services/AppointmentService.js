// services/AppointmentService.js
const { Appointment } = require("../models");
const StudentService = require("./StudentService");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");

class AppointmentService {
  async createAppointment(studentId, appointmentData) {
    try {
      logger.info(`Creating appointment for student ${studentId}`);

      // Create the appointment using the model
      return await Appointment.createAppointment({
        studentId,
        service: appointmentData.service,
        startTime: new Date(appointmentData.startTime),
        duration: Number(appointmentData.duration),
        notes: appointmentData.notes,
        status: "PENDING",
      });
    } catch (error) {
      logger.error("Failed to create appointment:", error);
      throw new ApiError(500, "Failed to create appointment");
    }
  }

  async getAppointmentsByStudentId(studentId) {
    try {
      return await Appointment.findByStudent(studentId);
    } catch (error) {
      logger.error(`Get appointments failed: ${error.message}`);
      throw new ApiError(500, "Failed to fetch appointments");
    }
  }

  async getPendingAppointments(providerId) {
    try {
      return await Appointment.find({
        where: {
          providerId,
          status: "PENDING",
        },
      });
    } catch (error) {
      logger.error("Failed to fetch pending appointments:", error);
      throw new ApiError(500, "Failed to fetch pending appointments");
    }
  }

  async getAppointmentById(appointmentId) {
    try {
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        throw new ApiError(404, "Appointment not found");
      }
      return appointment;
    } catch (error) {
      logger.error("Failed to fetch appointment:", error);
      throw new ApiError(500, "Failed to fetch appointment");
    }
  }

  async updateAppointment(appointmentId, updateData) {
    try {
      const appointment = await Appointment.update(appointmentId, updateData);
      if (!appointment) {
        throw new ApiError(404, "Appointment not found");
      }
      return appointment;
    } catch (error) {
      logger.error("Failed to update appointment:", error);
      throw new ApiError(500, "Failed to update appointment");
    }
  }

  async deleteAppointment(appointmentId) {
    try {
      const appointment = await Appointment.delete(appointmentId);
      if (!appointment) {
        throw new ApiError(404, "Appointment not found");
      }
      return { message: "Appointment deleted successfully" };
    } catch (error) {
      logger.error("Failed to delete appointment:", error);
      throw new ApiError(500, "Failed to delete appointment");
    }
  }

  async cancelAppointment(appointmentId) {
    try {
      const appointment = await Appointment.updateStatus(
        appointmentId,
        "CANCELLED"
      );
      if (!appointment) {
        throw new ApiError(404, "Appointment not found");
      }
      return { message: "Appointment cancelled successfully" };
    } catch (error) {
      logger.error("Failed to cancel appointment:", error);
      throw new ApiError(500, "Failed to cancel appointment");
    }
  }
}

// Export as singleton instance
module.exports = new AppointmentService();
