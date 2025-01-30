import { z } from "zod";

const configSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  PORT: z.number().int().positive(),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
});

export const validateConfig = (config) => {
  try {
    return configSchema.parse(config);
  } catch (error) {
    throw new Error(`Config validation failed: ${error.message}`);
  }
};
