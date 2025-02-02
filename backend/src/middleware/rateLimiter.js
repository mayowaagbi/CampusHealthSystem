const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const redisClient = require("../config/redis");

// Check if Redis is available
const isRedisAvailable = redisClient && typeof redisClient.call === "function";

// Configure the rate limiter
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable legacy headers
  message: "Too many requests, please try again later",
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({ message: options.message });
  },
};

// Add Redis store only if available
if (isRedisAvailable) {
  rateLimitConfig.store = new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
  });
}

// Create the rate limiter middleware
const apiLimiter = rateLimit(rateLimitConfig);

// Log Redis connection status
console.log(
  `Rate limiter using ${isRedisAvailable ? "Redis" : "in-memory"} store.`
);

module.exports = apiLimiter;
