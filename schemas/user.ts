import { z } from 'zod'

export const bodyUserSchema = z.object({
  body: z.object({
    name: z.string(),
    username: z.string().min(1).max(20),
    email: z.string().email(),
    password: z.string().min(1).max(25),
    role: z.string(),
    points: z.number().int().nonnegative().default(0),
  })
})

export const createUserSchema = z.object({
  body: bodyUserSchema.shape.body
    .extend({
      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
    })
    .refine((body) => body.password === body.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const idUserSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9]+$/, 'id must be a number')
  })
})

export const userSchema = z.object({
  body: bodyUserSchema.shape.body,
  params: idUserSchema.shape.params
})
