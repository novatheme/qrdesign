import { z } from "zod";

export const generateQRSchema = z.object({
  bankBin: z.string().length(6, "Bank BIN must be 6 digits"),
  accountNumber: z.string().min(6, "Invalid account number"),
  accountName: z.string().optional(),
  amount: z.number().positive().optional(),
  description: z.string().max(25, "Description too long").optional(),
  externalRef: z.string().optional(),
});

export type GenerateQRInput = z.infer<typeof generateQRSchema>;
