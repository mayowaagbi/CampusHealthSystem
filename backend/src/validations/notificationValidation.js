const { z } = require("zod");

export const notificationSchema = z.object({
  message: z.string().min(10).max(500),
  userIds: z.array(z.string().uuid()).min(1),
});

export const markReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1),
});
