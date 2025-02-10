const AppointmentService = require("../services/AppointmentService");
const StudentService = require("../services/StudentService");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const asyncHandler = require("../utils/asyncHandler");

class AppointmentController {
  // Create a new appointment (only for students)
  createAppointment = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { service, startTime, notes, duration } = req.body;

      console.log("UserID from token:", userId);
      console.log("Request Body:", req.body);

      if (!userId) {
        return errorResponse(res, "User ID is required.", 400);
      }

      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        console.error(`No student found for userId ${userId}`);
        return errorResponse(res, "Student not found.", 404);
      }

      console.log("Student found:", student);

      // Create the appointment
      const appointment = await AppointmentService.createAppointment(
        student.id,
        {
          service,
          startTime,
          notes,
          duration: parseInt(duration, 10),
        }
      );

      console.log("Appointment successfully created:", appointment);
      successResponse(res, appointment, 201);
    } catch (error) {
      console.error("Error in createAppointment:", error);
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Fetch all appointments for the logged-in student
  // Fetch all appointments for the logged-in student
  getAppointments = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;

      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        return errorResponse(res, "Student not found.", 404);
      }

      // Fetch all appointments for the student
      const appointments = await AppointmentService.getAppointmentsByStudentId(
        student.id
      );

      successResponse(res, appointments);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Fetch details of a specific appointment (only if the student owns it)
  getAppointmentDetails = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      // const { id } = req.params;

      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        return errorResponse(res, "Student not found.", 404);
      }
      console.log("Student found in get:", student);
      // Fetch the appointment
      const appointment = await AppointmentService.getAppointmentById(
        student.id
      );

      // Verify the appointment belongs to the student
      if (!appointment || appointment.studentId !== student.id) {
        return errorResponse(res, "Appointment not found.", 404);
      }

      successResponse(res, appointment);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Cancel a specific appointment (only if the student owns it)
  cancelAppointment = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        return errorResponse(res, "Student not found.", 404);
      }

      // Fetch the appointment
      const appointment = await AppointmentService.getAppointmentById(id);

      // Verify the appointment belongs to the student
      if (!appointment || appointment.studentId !== student.id) {
        return errorResponse(res, "Appointment not found.", 404);
      }

      // Cancel the appointment
      await AppointmentService.cancelAppointment(id);
      successResponse(res, { message: "Appointment canceled successfully" });
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Update an appointment (only if the student owns it)
  updateAppointment = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const appointmentData = req.body;

      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        return errorResponse(res, "Student not found.", 404);
      }

      // Fetch the appointment
      const appointment = await AppointmentService.getAppointmentById(id);

      // Verify the appointment belongs to the student
      if (!appointment || appointment.studentId !== student.id) {
        return errorResponse(res, "Appointment not found.", 404);
      }

      // Update the appointment
      const updatedAppointment = await AppointmentService.updateAppointment(
        id,
        appointmentData
      );
      successResponse(res, updatedAppointment);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Delete an appointment (only if the student owns it)
  deleteAppointment = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        return errorResponse(res, "Student not found.", 404);
      }

      // Fetch the appointment
      const appointment = await AppointmentService.getAppointmentById(id);

      // Verify the appointment belongs to the student
      if (!appointment || appointment.studentId !== student.id) {
        return errorResponse(res, "Appointment not found.", 404);
      }

      // Delete the appointment
      await AppointmentService.deleteAppointment(id);
      successResponse(res, { message: "Appointment deleted successfully" });
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });
}

module.exports = new AppointmentController();
