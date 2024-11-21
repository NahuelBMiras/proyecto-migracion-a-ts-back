import type { z } from 'zod'
import type { bodyTransactionSchema, idTransactionSchema } from '@/schemas/transaction'

export type BodyTransactionType = z.infer<typeof bodyTransactionSchema>['body']
export type IdTransactionType = z.infer<typeof idTransactionSchema>['params']
