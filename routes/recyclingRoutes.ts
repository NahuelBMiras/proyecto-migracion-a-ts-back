import express from 'express';
import { confirmRecycling } from '@/controllers/recyclingController';
import userMiddleware from '../middleware/authMiddleware';
const router = express.Router();

router.route("/confirmation").post( userMiddleware,confirmRecycling);
console.log("probando");
export default router;