const { createClient } = require("redis");
const dotenv = require("dotenv");
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.error("Redis Error:", err));

redisClient.connect();

module.exports = redisClient;
