import redis from "../config/redis.js";

export const cacheMiddleware =
  (keyPrefix, ttl = 300) =>
  async (req, res, next) => {
    const key = `${keyPrefix}:${req.originalUrl}`;

    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      const originalSend = res.send;
      res.send = (body) => {
        redis.setex(key, ttl, body);
        originalSend.call(res, body);
      };

      next();
    } catch (error) {
      next();
    }
  };
