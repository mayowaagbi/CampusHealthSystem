const AppointmentService = require("../services/AppointmentService");
const StudentService = require("../services/StudentService");
const ProviderService = require("../services/ProviderService");
const SupportService = require("../services/SupportService");
const { sendEmail } = require("../utils/mailer");
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

  rescheduleAppointment = asyncHandler(async (req, res) => {
    try {
      const userId = req.user.id;
      const { id } = req.params;
      const { startTime, service, duration } = req.body;
      console.log("[Backend] Rescheduling appointment ID:", id);
      console.log("[Backend] Request body:", req.body);
      // Find the student
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        return errorResponse(res, "Student not found.", 404);
      }
      console.log("[Backend] Student found:", student);
      // Fetch the appointment
      const appointment = await AppointmentService.getAppointmentById(id);

      console.log("[Backend] Appointment found:", appointment);
      console.log("[Backend] Appointment studentId:", appointment.studentId);
      // Verify the appointment belongs to the student
      if (!appointment || appointment.studentId !== student.id) {
        console.error("[Backend] Appointment not found:", id);
        return errorResponse(res, "Appointment not found.", 404);
      }

      // Reschedule the appointment
      const updatedAppointment = await AppointmentService.rescheduleAppointment(
        id,
        {
          startTime: new Date(startTime),
          service,
          duration: parseInt(duration, 10),
          status: "RESCHEDULED",
        }
      );
      console.log(
        "[Backend] Appointment rescheduled successfully:",
        updatedAppointment
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
      console.log("[Backend] Student found:", student);
      // Fetch the appointment
      const appointment = await AppointmentService.getAppointmentById(id);

      console.log("[Backend] Appointment found:", appointment);
      console.log("[Backend] Appointment studentId:", appointment.studentId);
      // Verify the appointment belongs to the student
      if (!appointment || appointment.studentId !== student.id) {
        console.error("[Backend] Appointment not found:", id);
        return errorResponse(res, "Appointment not found.", 404);
      }

      // Delete the appointment
      await AppointmentService.deleteAppointment(id);
      successResponse(res, { message: "Appointment deleted successfully" });
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Get appointments for provider (NEW)
  getProviderAppointments = asyncHandler(async (req, res) => {
    try {
      const providerId = req.user.id;
      const appointments = await AppointmentService.getProviderAppointments(
        providerId
      );
      successResponse(res, appointments);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Update appointment status (NEW)
  updateAppointmentStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const providerId = req.user.id;

      const updatedAppointment = await AppointmentService.updateStatus(
        id,
        status,
        providerId
      );

      // Send email notification
      if (["CONFIRMED", "DENIED"].includes(status)) {
        await sendEmail({
          to: updatedAppointment.student.profile.user.email,
          subject: `Appointment ${status}`,
          text: `Your appointment has been ${status.toLowerCase()}.\n\nDetails:\n
          Date: ${updatedAppointment.startTime}\n
          Provider: ${updatedAppointment.provider.profile.firstName}`,
        });
      }

      successResponse(res, updatedAppointment);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  // Assign support (NEW)
  assignSupport = asyncHandler(async (req, res) => {
    try {
      console.log("Assigning support to appointment...");
      const { id } = req.params;
      const { supportId } = req.body;
      console.log("providerId:", req.user.id);
      const provider = await ProviderService.findByUserId(req.user.id);
      console.log("Fetching provider...");

      if (!provider) {
        return res.status(403).json({
          success: false,
          message: "Provider not found",
        });
      }
      console.log("Fetching appointment...");
      const appointment = await AppointmentService.getAppointmentById(id);
      console.log("Appointment found:", appointment.duration);
      if (!supportId) {
        return errorResponse(res, "Support ID is required", 400);
      }

      if (isNaN(appointment.duration) || appointment.duration <= 0) {
        return errorResponse(res, "Invalid appointment duration", 400);
      }
      console.log("Checking support availability...");
      // Check availability with exclusion
      const isAvailable = await SupportService.checkAvailability(
        supportId,
        appointment.startTime,
        appointment.duration,
        id // Exclude current appointment from conflict check
      );
      console.log("Support availability result:", isAvailable);
      if (!isAvailable) {
        return errorResponse(
          res,
          "Support staff has conflicting appointments",
          409
        );
      }
      console.log("Assigning support...");
      const updatedAppointment = await AppointmentService.assignSupport(
        id,
        supportId,
        provider.id
      );

      successResponse(res, {
        ...updatedAppointment,
        support: updatedAppointment.support
          ? {
              id: updatedAppointment.support.id,
              name: `${updatedAppointment.support.profile.firstName} ${updatedAppointment.support.profile.lastName}`,
            }
          : null,
      });
    } catch (error) {
      console.error("[ASSIGN SUPPORT ERROR]", error);
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  updateAppointmentStatus = asyncHandler(async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const providerId = req.user.id;
      console.log("Updating appointment:", { id, status, providerId });
      // Fetch the appointment first
      console.log("[Controller] Fetching appointment...");
      const appointment = await AppointmentService.getAppointmentById(id);
      console.log("[Controller] Fetched appointment:", appointment);

      // Check if the logged-in provider is authorized to modify this appointment
      // if (appointment.providerId !== providerId) {
      //   console.log("[Controller] Unauthorized provider:", providerId);
      //   throw new ApiError(403, "Not authorized to modify this appointment");
      // }

      // Update the appointment status
      console.log("[Controller] Updating appointment status...");
      const updatedAppointment = await AppointmentService.updateStatus(
        id,
        status,
        providerId
      );

      console.log("[Controller] Updated appointment:", updatedAppointment);
      // Send email notification if status is CONFIRMED or DENIED
      if (["CONFIRMED", "DENIED"].includes(status)) {
        const studentEmail = updatedAppointment.student.profile.user.email;
        const subject = `Appointment ${status}`;
        const html = `
          <h1>Appointment ${status}</h1>
          <p>Your appointment has been ${status.toLowerCase()}.</p>
          <p><strong>Details:</strong></p>
          <ul>
            <li>Date: ${new Date(
              updatedAppointment.startTime
            ).toLocaleDateString()}</li>
            <li>Time: ${new Date(
              updatedAppointment.startTime
            ).toLocaleTimeString()}</li>
            <li>Service: ${updatedAppointment.service}</li>
          </ul>
        `;

        await sendEmail(studentEmail, subject, html);
        console.log("[Controller] Email sent successfully.");
      }

      successResponse(res, updatedAppointment);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });

  getAllAppointments = asyncHandler(async (req, res) => {
    try {
      const appointments = await AppointmentService.getAllAppointments();
      successResponse(res, appointments);
    } catch (error) {
      errorResponse(res, error.message, error.statusCode || 500);
    }
  });
}

module.exports = new AppointmentController();
