"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Ruta para obtener los puntos disponibles del usuario
router.get('/:id/points', authMiddleware_1.default, userController_1.getUser);
// Ruta para actualizar los puntos del usuario
router.put('/:id/points', authMiddleware_1.default, userController_1.updateUserPoints);
exports.default = router;
