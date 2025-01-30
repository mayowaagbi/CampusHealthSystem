const { prisma } = require("../db");
const { redis } = require("../cache");

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
