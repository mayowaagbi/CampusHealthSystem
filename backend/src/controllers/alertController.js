// src/controllers/AlertController.js
const AlertService = require("../services/AlertService");
const UserModel = require("../models/User");
class AlertController {
  // constructor() {
  //   this.alertService = new AlertService();
  // }

  // src/controllers/AlertController.js
  async createAlert(req, res) {
    try {
      const { title, message, priority, duration } = req.body;

      // Get students with their StudentDetails IDs
      const users = await UserModel.getAllStudents();

      // Extract StudentDetails IDs, filtering out nulls
      const studentDetailsIds = users
        .map((user) => user.profile?.studentDetails?.id)
        .filter((id) => id);

      // Create alert with correct student associations
      const alert = await AlertService.createAlert({
        title,
        message,
        priority,
        duration,
        createdById: req.user.id,
        studentIds: studentDetailsIds,
      });

      // Broadcast logic
      console.log("Broadcasting alert to students:", studentDetailsIds);
      const io = req.app.get("io");
      users.forEach((user) => {
        if (user.profile?.studentDetails?.id) {
          const studentDetailsId = user.profile.studentDetails.id;
          console.log(`Broadcasting alert to student ${studentDetailsId}`);
          io.to(studentDetailsId).emit("new-alert", alert); // Emit to the correct room
        }
      });

      res.status(201).json(alert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getallAlerts(req, res) {
    try {
      const alerts = await AlertService.getallAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAlert(req, res) {
    try {
      const id = req.params.id;
      console.log("Controller - Deleting alert with ID:", id); // Correctly extracts the ID from the request parameters
      await AlertService.deleteAlert(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async publishAlert(req, res) {
    try {
      const { id } = req.params;

      // Publish the alert
      const { updatedAlert, students } = await AlertService.publishAlert(id);

      // Broadcast the alert to all students via Socket.io
      const io = req.app.get("io");
      students.forEach((student) => {
        io.to(student.id).emit("alert-update", updatedAlert);
      });

      res.status(200).json(updatedAlert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateAlertStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const updatedAlert = await AlertService.updateAlertStatus(id, status);
      res.status(200).json(updatedAlert);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// module.exports = AlertController;
module.exports = new AlertController();
