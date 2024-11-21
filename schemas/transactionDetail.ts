import { z } from 'zod';

export const transactionDetailSchema = z.object({
  id: z.number().int(),
  transactionId: z.number().int().optional(),
  materialId: z.number().int().optional(),
  weight: z.number().optional(),
  points: z.number().int().optional(),
});