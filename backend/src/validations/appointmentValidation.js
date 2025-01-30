const { z } = require("zod");
const { AppointmentStatus } = require("../models/Appointment");
// import { AppointmentStatus } from "@prisma/client";
export const createAppointmentSchema = z.object({
  providerId: z.string().uuid(),
  startTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "Start time must be in the future",
  }),
  duration: z.number().min(15).max(120),
  notes: z.string().max(500).optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.nativeEnum(AppointmentStatus).optional(),
  startTime: z.coerce.date().optional(),
  duration: z.number().min(15).max(120).optional(),
});
