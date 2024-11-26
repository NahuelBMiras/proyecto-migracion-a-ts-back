import express from 'express';
import { getCoupons, redeemCoupon } from '../controllers/_couponController';
import userMidlleware from '../middleware/authMiddleware';

const router = express.Router();

// Ruta para obtener los cupones disponibles
router.get('/', userMidlleware, getCoupons);

// Ruta para canjear un cupón
router.post('/redeem', userMidlleware, redeemCoupon);

export default router;
