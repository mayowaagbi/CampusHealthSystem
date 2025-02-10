const { AppointmentService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const asyncHandler = require("../utils/asyncHandler");
const StudentService = require("../services/StudentService");
const { validateRequest } = require("../middleware/validationMiddleware");
const {
  createAppointmentSchema,
} = require("../validations/appointmentValidation");

class AppointmentController {
  // Create a new appointment (only for students)
  // createAppointment = asyncHandler(async (req, res) => {
  //   // Correctly extract userId from req.user
  //   const userId = req.user.id; // ✅ Directly access req.user.id

  //   const { service, startTime, notes } = req.body;

  //   // Debugging logs
  //   console.log("========== Incoming Request ==========");
  //   console.log("UserID from token:", userId); // Log the userId
  //   console.log("req.user:", req.user); // Log the entire req.user object
  //   console.log("Request Body:", req.body);
  //   console.log("Service in backend:", service);
  //   console.log("StartTime in backend:", startTime);
  //   console.log("Notes in backend:", notes);
  //   console.log("======================================");

  //   // Check if userId exists
  //   if (!userId) {
  //     console.error("Error: userId is missing in request parameters.");
  //     return errorResponse(res, "User ID is required.", 400);
  //   }

  //   // Find the student associated with the user
  //   const student = await AppointmentService.findStudentByUserId(userId);

  //   // Debugging student retrieval
  //   if (!student) {
  //     console.error(`Error: No student found with userId ${userId}`);
  //     return errorResponse(res, "Student not found.", 404);
  //   }

  //   console.log("Student found:", student);

  //   // Create the appointment
  //   try {
  //     const appointment = await AppointmentService.createAppointment({
  //       service,
  //       startTime,
  //       notes,
  //       studentId: student.id, // Associate appointment with the student
  //     });

  //     console.log("Appointment successfully created:", appointment);
  //     successResponse(res, appointment, 201);
  //   } catch (error) {
  //     console.error("Error creating appointment:", error);
  //     return errorResponse(res, "Failed to create appointment.", 500);
  //   }
  // });

  async createAppointment(req, res) {
    try {
      // Get user ID from the authenticated token (populated in req.user by auth middleware)
      const userId = req.user.id;
      const { service, startTime, notes } = req.body;

      console.log("UserID from token:", userId);
      console.log("Request Body:", req.body);

      if (!userId) {
        return errorResponse(res, "User ID is required.", 400);
      }
      console.log("StudentService:", StudentService);
      console.log(
        "StudentService.findStudentByUserId:",
        StudentService.findStudentByUserId
      );
      // Use StudentService to find the student record
      const student = await StudentService.findStudentByUserId(userId);
      if (!student) {
        console.error(`No student found for userId ${userId}`);
        return errorResponse(res, "Student not found.", 404);
      }

      console.log("Student found:", student);

      // Create the appointment using the student's id
      const appointment = await AppointmentService.createAppointment(
        student.id,
        {
          service,
          startTime,
          notes,
          duration: parseInt(req.body.duration, 10),
        }
      );

      console.log("Appointment successfully created:", appointment);
      successResponse(res, appointment, 201);
    } catch (error) {
      console.error("Error in createAppointment:", error);
      return errorResponse(res, error.message, error.statusCode || 500);
    }
  }

  // Fetch all appointments for the logged-in student
  getAppointments = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Find the student associated with the user
    const student = await StudentService.findStudentByUserId(userId);
    if (!student) {
      return errorResponse(res, "Student not found.", 404);
    }

    // Fetch appointments for the student
    const appointments = await AppointmentService.getAppointmentsByStudentId(
      student.id
    );
    successResponse(res, appointments);
  });

  // Fetch details of a specific appointment (only if the student owns it)
  getAppointmentDetails = asyncHandler(async (req, res) => {
    const { userid } = req.user; // Get user ID from the token
    const { id } = req.params;

    // Find the student associated with the user
    const student = await AppointmentService.findStudentByUserId(userid);
    if (!student) {
      return errorResponse(res, "Student not found.", 404);
    }

    // Fetch the appointment
    const appointment = await AppointmentService.getAppointmentById(id);

    // Verify the appointment belongs to the student
    if (!appointment || appointment.studentId !== student.id) {
      return errorResponse(res, "Appointment not found.", 404);
    }

    successResponse(res, appointment);
  });

  // Cancel a specific appointment (only if the student owns it)
  cancelAppointment = asyncHandler(async (req, res) => {
    const { userid } = req.user; // Get user ID from the token
    const { id } = req.params;

    // Find the student associated with the user
    const student = await AppointmentService.findStudentByUserId(userid);
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
  });

  // Update an appointment (only if the student owns it)
  updateAppointment = asyncHandler(async (req, res) => {
    const { userid } = req.user; // Get user ID from the token
    const { id } = req.params;
    const appointmentData = req.body;

    // Find the student associated with the user
    const student = await AppointmentService.findStudentByUserId(userid);
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
  });

  // Delete an appointment (only if the student owns it)
  deleteAppointment = asyncHandler(async (req, res) => {
    const { userid } = req.user; // Get user ID from the token
    const { id } = req.params;

    // Find the student associated with the user
    const student = await AppointmentService.findStudentByUserId(userid);
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
  });
}

module.exports = new AppointmentController();
