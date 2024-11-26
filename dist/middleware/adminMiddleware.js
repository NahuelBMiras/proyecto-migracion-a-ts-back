"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.roles.includes('admin')) {
        next();
    }
    else {
        return res.status(httpStatus_1.default.FORBIDDEN).json({ message: 'Acceso denegado. Solo para administradores.' });
    }
};
exports.default = adminMiddleware;
