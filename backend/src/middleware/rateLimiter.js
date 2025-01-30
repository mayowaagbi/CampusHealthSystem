import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../config/redis";

/**
 * API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: redisClient
    ? new RedisStore({
        sendCommand: (...args) => redisClient.call(...args),
      })
    : undefined,
  message: "Too many requests, please try again later",
});
