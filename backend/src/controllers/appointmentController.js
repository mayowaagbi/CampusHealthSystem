const { AppointmentService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const asyncHandler = require("../utils/asyncHandler");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createAppointmentSchema,
} = require("../validations/appointmentValidation");

class AppointmentController {
  createAppointment = asyncHandler(async (req, res) => {
    const appointmentData = req.body;
    const appointment = await AppointmentService.createAppointment(
      appointmentData
    );
    successResponse(res, appointment, 201);
  });

  getAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await AppointmentService.getAppointmentById(id);
    successResponse(res, appointment);
  });

  updateAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointmentData = req.body;
    const updatedAppointment = await AppointmentService.updateAppointment(
      id,
      appointmentData
    );
    successResponse(res, updatedAppointment);
  });

  deleteAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AppointmentService.deleteAppointment(id);
    successResponse(res, { message: "Appointment deleted successfully" });
  });

  getAppointments = asyncHandler(async (req, res) => {
    const appointments = await AppointmentService.getAppointments();
    successResponse(res, appointments);
  });

  cancelAppointment = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AppointmentService.cancelAppointment(id);
    successResponse(res, { message: "Appointment canceled successfully" });
  });

  getAppointmentDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await AppointmentService.getAppointmentById(id);
    successResponse(res, appointment);
  });
}

module.exports = new AppointmentController();
