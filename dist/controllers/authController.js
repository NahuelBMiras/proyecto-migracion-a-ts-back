"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = require("../utils/bcrypt");
const tokenManagement_1 = require("../utils/tokenManagement");
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const prisma = new client_1.PrismaClient();
// Registro de usuario
const register = async (req, res) => {
    console.log('Método de la solicitud:', req.method);
    console.log('Datos recibidos:', req.body);
    const { name, username, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        res
            .status(httpStatus_1.default.BAD_REQUEST)
            .json({ message: "Las contraseñas no coinciden" });
        return; // Aseguramos que no se continúe ejecutando el código después de responder
    }
    try {
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            res
                .status(httpStatus_1.default.BAD_REQUEST)
                .json({ message: "Se registrado exitosamente" });
            return;
        }
        const hashedPassword = await (0, bcrypt_1.hashPassword)(password);
        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                role: "user",
            },
        });
        console.log('Nuevo usuario creado:', newUser);
        res
            .status(httpStatus_1.default.CREATED)
            .json({ message: "Usuario registrado exitosamente", user: newUser });
    }
    catch (error) {
        console.log(error);
        res
            .status(httpStatus_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "Error al registrar usuario", error });
    }
};
exports.register = register;
// Login de usuario
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res
                .status(httpStatus_1.default.UNAUTHORIZED)
                .json({ message: "Credenciales incorrectas" });
            return;
        }
        const validPassword = await (0, bcrypt_1.comparePassword)(password, user.password);
        if (!validPassword) {
            res
                .status(httpStatus_1.default.UNAUTHORIZED)
                .json({ message: "Credenciales incorrectas" });
            return;
        }
        const token = (0, tokenManagement_1.generateToken)(user);
        res
            .status(httpStatus_1.default.OK)
            .json({ message: "Tokens generados", token, userId: user.id, role: user.role });
    }
    catch (error) {
        if (error instanceof Error) {
            res
                .status(httpStatus_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Error al iniciar sesión", error: error.message });
        }
        else {
            res
                .status(httpStatus_1.default.INTERNAL_SERVER_ERROR)
                .json({ message: "Error desconocido", error });
        }
    }
};
exports.login = login;
