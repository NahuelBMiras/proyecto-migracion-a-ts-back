"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const _couponController_1 = require("../controllers/_couponController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Ruta para obtener los cupones disponibles
router.get('/', authMiddleware_1.default, _couponController_1.getCoupons);
// Ruta para canjear un cupón
router.post('/redeem', authMiddleware_1.default, _couponController_1.redeemCoupon);
exports.default = router;
