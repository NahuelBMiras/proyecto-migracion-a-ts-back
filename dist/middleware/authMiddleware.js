"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenManagement_1 = require("../utils/tokenManagement");
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const userMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        res.status(httpStatus_1.default.UNAUTHORIZED).json({ message: "Token no proporcionado" });
        return; // Aquí no devolvemos nada, simplemente terminamos el flujo
    }
    const decoded = (0, tokenManagement_1.verifyToken)(token);
    if (!decoded) {
        res.status(httpStatus_1.default.UNAUTHORIZED).json({ message: "Token inválido" });
        return; // Aquí tampoco devolvemos nada, simplemente terminamos el flujo
    }
    // Tipar correctamente req.user como CustomJwtPayload
    req.user = decoded; // Ahora req.user tiene id, email, roles
    next(); // Llamar a next() para continuar el flujo sin retornar nada
};
exports.default = userMiddleware;
