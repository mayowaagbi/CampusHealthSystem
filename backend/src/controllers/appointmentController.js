const { AppointmentService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createAppointmentSchema,
} = require("../validations/appointmentValidation");

class AppointmentController {
  createAppointment = asyncHandler(async (req, res) => {
    const appointment = await AppointmentService.createAppointment(
      req.user.id,
      req.body.providerId,
      req.body
    );
    successResponse(res, appointment, 201);
  });

  getAppointments = asyncHandler(async (req, res) => {
    const appointments = await AppointmentService.getUserAppointments(
      req.user.id
    );
    successResponse(res, appointments);
  });

  cancelAppointment = asyncHandler(async (req, res) => {
    await AppointmentService.cancelAppointment(req.params.id, req.user.id);
    successResponse(res, { message: "Appointment cancelled successfully" });
  });
}

export default new AppointmentController();
