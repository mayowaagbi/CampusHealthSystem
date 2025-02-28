const StudentService = require("../services/StudentService");

const StudentController = {
  /**
   * Get list of students
   */
  async getStudents(req, res) {
    try {
      const { search, status } = req.query;
      const students = await StudentService.getStudentsService(search, status);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get a student by user ID
   */
  async getStudentByUserId(req, res) {
    try {
      const { userId } = req.params;
      const student = await StudentService.findStudentByUserId(userId);
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = StudentController;
