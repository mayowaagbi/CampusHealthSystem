import { z } from "zod";

export const emergencyContactSchema = z.object({
  name: z.string().min(2),
  relationship: z.string().min(2),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email().optional(),
});

export const emergencyTriggerSchema = z.object({
  location: z.string().min(5),
});
