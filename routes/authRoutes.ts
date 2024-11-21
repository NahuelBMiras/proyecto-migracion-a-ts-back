import express from 'express';
import { login, register } from '@/controllers/authController';
import { schemaValidator } from '@/middleware/schemaValidator';
import { createUserSchema } from '@/schemas/user';

const router = express.Router();

router.post('/register', schemaValidator(createUserSchema), register);
router.post('/login', login);



export default router;

