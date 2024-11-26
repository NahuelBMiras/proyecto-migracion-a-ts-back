"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokenManagement_1 = require("../utils/tokenManagement");
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const userMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    if (!token) {
        res.status(httpStatus_1.default.UNAUTHORIZED).json({ message: "Token no proporcionado" });
        return; // Asegúrate de no continuar el flujo de la solicitud después de enviar la respuesta
    }
    const decoded = (0, tokenManagement_1.verifyToken)(token);
    if (!decoded) {
        res.status(httpStatus_1.default.UNAUTHORIZED).json({ message: "Token inválido" });
        return; // Lo mismo aquí, terminamos la ejecución después de enviar la respuesta
    }
    req.user = decoded; // Ahora TypeScript reconoce la propiedad `user`
    next(); // Llamamos a `next()` para que el flujo siga
};
exports.default = userMiddleware;
