import prisma from "../config/prismaClient.js";
import redis from "../config/redis.js";

export const checkDatabaseHealth = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    await redis.ping();
    return true;
  } catch (error) {
    return false;
  }
};

export const checkStorageHealth = async () => {
  // Implement storage health check
};
