const authMiddleware = require("./authMiddleware");
const errorHandler = require("./errorHandler");
const validationMiddleware = require("./validationMiddleware");
const auditLogger = require("./auditLogger");
const rateLimiter = require("./rateLimiter");
const corsMiddleware = require("./corsMiddleware");
const requestSanitizer = require("./requestSanitizer");

module.exports = {
  ...authMiddleware,
  ...errorHandler,
  ...validationMiddleware,
  ...auditLogger,
  ...rateLimiter,
  ...corsMiddleware,
  ...requestSanitizer,
};
