// src/validators/profileValidator.js
const { body } = require("express-validator");

const validateProfile = [
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("phone").isMobilePhone().withMessage("Invalid phone number"),
  body("emergencyContacts.*.name")
    .notEmpty()
    .withMessage("Contact name required"),
  body("emergencyContacts.*.phone")
    .isMobilePhone()
    .withMessage("Invalid contact phone"),
];

module.exports = { validateProfile };
