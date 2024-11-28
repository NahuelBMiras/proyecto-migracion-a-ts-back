"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const registerValidationMiddleware_1 = require("../middleware/registerValidationMiddleware");
const router = express_1.default.Router();
router.post('/register', registerValidationMiddleware_1.validateRegister, authController_1.register);
router.post('/login', authController_1.login);
exports.default = router;
