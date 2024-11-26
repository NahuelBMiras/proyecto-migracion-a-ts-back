"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
// utils/tokenManagement.ts
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// La función para generar el token
const generateToken = (user) => {
    const userId = user.id.toString();
    return jsonwebtoken_1.default.sign({ id: userId, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: "1d",
    });
};
exports.generateToken = generateToken;
// La función para verificar el token
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
