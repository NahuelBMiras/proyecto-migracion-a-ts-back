import { z } from 'zod'

export const bodyTransactionSchema = z.object({
  body: z.object({
    userId: z.number().int(),
    recyclingPointId: z.number().int().optional(),
    adminId: z.number().int().optional(),
    transactionDate: z.date().nullable().default(() => new Date()),
    totalPoints: z.number().int(),
    state: z.boolean(),
    details: z.string().array().nonempty(),
  })
})

export const idTransactionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9]+$/, 'id must be a number')
  })
})