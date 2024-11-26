"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRegister = void 0;
const joi_1 = __importDefault(require("joi"));
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
// Aseguramos que la función retorna void
const validateRegister = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
        username: joi_1.default.string().min(3).required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(6).required(),
        confirmPassword: joi_1.default.string().valid(joi_1.default.ref("password")).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
        // En caso de error, respondemos con el mensaje
        res.status(httpStatus_1.default.BAD_REQUEST).json({ message: error.details[0].message });
        return; // Importante: no llamamos a next() si hay error
    }
    next(); // Si no hay error, pasamos al siguiente middleware
};
exports.validateRegister = validateRegister;
