const express = require("express");
const StudentController = require("../controllers/StudentController");

const router = express.Router();

router.get("/", StudentController.getStudents);

module.exports = router;
