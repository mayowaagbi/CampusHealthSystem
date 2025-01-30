const { z } = require("zod");
export const healthRecordSchema = z.object({
  diagnosis: z.string().min(3),
  prescription: z.string().min(3),
  notes: z.string().max(1000).optional(),
});

export const documentUploadSchema = z.object({
  recordId: z.string().uuid(),
  file: z.any().refine((file) => file, "File is required"),
});
