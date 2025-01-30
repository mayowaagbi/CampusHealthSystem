const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
/**
 * Security middleware stack
 */
export const securityMiddleware = [
  helmet(),
  xss(),
  mongoSanitize(),
  (req, res, next) => {
    // Remove HTTP headers
    res.removeHeader("X-Powered-By");
    next();
  },
];
