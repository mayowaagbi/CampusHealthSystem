const { z } = require("zod");
const { UserRole } = require("../models/User");
// import { UserRole } from "@prisma/client";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
  role: z.nativeEnum(UserRole),
  profile: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    dateOfBirth: z.coerce.date(),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  }),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});
