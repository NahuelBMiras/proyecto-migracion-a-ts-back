import express from 'express';
import { login, register } from '../controllers/authController';
import { validateRegister } from '../middleware/registerValidationMiddleware';

const router = express.Router();

router.post('/register', validateRegister, register);
router.post('/login', login);



export default router;

