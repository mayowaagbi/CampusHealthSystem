const express = require("express");
const StudentController = require("../controllers/StudentController");

const router = express.Router();

router.get("/", StudentController.getStudents);
router.get(
  "/users/:userId/student-details",
  StudentController.getStudentByUserId
);
module.exports = router;
