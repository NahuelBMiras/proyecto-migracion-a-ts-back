"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPoints = exports.searchUser = void 0;
const client_1 = require("@prisma/client");
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const prisma = new client_1.PrismaClient();
const searchUser = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, name: true, points: true }
        });
        if (!user) {
            res.status(httpStatus_1.default.NOT_FOUND).json({ message: "Usuario no encontrado" });
            return;
        }
        res.status(httpStatus_1.default.OK).json({ user });
    }
    catch (error) {
        console.error(error);
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({ message: "Error al buscar usuario" });
    }
};
exports.searchUser = searchUser;
const addPoints = async (req, res) => {
    const { userId, points, weights } = req.body;
    if (!req.user || typeof req.user.id !== 'string') {
        res.status(httpStatus_1.default.UNAUTHORIZED).json({ message: "Usuario no autenticado" });
        return;
    }
    try {
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) {
            res.status(httpStatus_1.default.NOT_FOUND).json({ message: "Usuario no encontrado" });
            return;
        }
        const updatedUser = await prisma.user.update({
            where: { id: Number(userId) },
            data: { points: { increment: points } }
        });
        const validWeights = Object.entries(weights).filter(([material, weight]) => {
            const parsedWeight = parseFloat(weight);
            return !isNaN(parsedWeight) && parsedWeight > 0;
        });
        function isValidMaterial(material) {
            return ['cardboard', 'glass', 'paper', 'metal', 'plastic'].includes(material);
        }
        const transaction = await prisma.transaction.create({
            data: {
                userId: Number(userId),
                adminId: Number(req.user.id),
                totalPoints: points,
                state: true,
                details: {
                    create: validWeights.map(([material, weight]) => {
                        const parsedWeight = parseFloat(weight);
                        // Verificar si el material es válido antes de proceder
                        if (!isValidMaterial(material)) {
                            throw new Error(`Material inválido: ${material}`);
                        }
                        return {
                            materialId: getMaterialId(material), // Aquí forzamos que 'material' sea del tipo 'Material'
                            weight: parsedWeight,
                            points: Math.ceil(parsedWeight * getPointsPerKg(material)) // Lo mismo para la función getPointsPerKg
                        };
                    })
                }
            }
        });
        res.status(httpStatus_1.default.OK).json({
            message: "Puntos agregados exitosamente",
            user: { id: updatedUser.id, email: updatedUser.email, points: updatedUser.points },
            transaction: { id: transaction.id, totalPoints: transaction.totalPoints }
        });
    }
    catch (error) {
        console.error(error);
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar puntos" });
    }
};
exports.addPoints = addPoints;
function getMaterialId(material) {
    const materialIds = {
        cardboard: 1,
        glass: 2,
        paper: 3,
        metal: 4,
        plastic: 5
    };
    return materialIds[material];
}
function getPointsPerKg(material) {
    const pointsPerKg = {
        cardboard: 10,
        glass: 5,
        paper: 8,
        metal: 15,
        plastic: 12
    };
    return pointsPerKg[material];
}
