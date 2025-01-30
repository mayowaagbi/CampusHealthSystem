import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

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
