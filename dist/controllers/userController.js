"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPoints = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const prisma = new client_1.PrismaClient();
const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            },
            select: {
                points: true, // solo selecciona los puntos del usuario
            },
        });
        if (!user) {
            res.status(httpStatus_1.default.NOT_FOUND).json({ message: "User not found" });
            return; // Aseguramos que terminamos la ejecución aquí
        }
        res.status(httpStatus_1.default.OK).json(user.points);
    }
    catch (error) {
        console.log("error al obtener los puntos del usuario: ", error);
        res
            .status(httpStatus_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "error en el servidor" });
    }
};
exports.getUser = getUser;
const updateUserPoints = async (req, res) => {
    try {
        const { id } = req.params;
        const { points } = req.body;
        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: {
                points: points,
            },
            select: {
                points: true,
            },
        });
        res.status(httpStatus_1.default.OK).json(updatedUser.points);
    }
    catch (error) {
        console.error("Error al actualizar los puntos del usuario: ", error);
        res
            .status(httpStatus_1.default.INTERNAL_SERVER_ERROR)
            .json({ message: "Error en el servidor al actualizar los puntos" });
    }
};
exports.updateUserPoints = updateUserPoints;
