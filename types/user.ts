import type { z } from 'zod'
import type { bodyUserSchema, createUserSchema, idUserSchema, userSchema } from '@/schemas/user'

export type BodyUserType = z.infer<typeof bodyUserSchema>['body']
export type RegisterType = z.infer<typeof createUserSchema>['body']
export type IdUserType = z.infer<typeof idUserSchema>['params']
export type User = z.infer<typeof userSchema>
