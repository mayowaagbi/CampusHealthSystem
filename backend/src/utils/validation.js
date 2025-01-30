import { z } from "zod";

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8).max(32);
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/);
export const uuidSchema = z.string().uuid();

export const validateEmail = (email) => emailSchema.safeParse(email);
export const validatePassword = (password) =>
  passwordSchema.safeParse(password);
