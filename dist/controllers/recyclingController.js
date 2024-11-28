"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmRecycling = void 0;
const client_1 = require("@prisma/client");
const httpStatus_1 = __importDefault(require("../helpers/httpStatus"));
const prisma = new client_1.PrismaClient();
const confirmRecycling = async (req, res) => {
    const { materials, location } = req.body;
    const userId = req?.user?.id;
    try {
        const transaction = await prisma.transaction.create({
            data: {
                userId: Number(userId),
                recyclingPointId: location.id,
                totalPoints: 0,
                state: false,
                details: {
                    create: materials.map((material) => ({
                        materialId: material.id,
                    }))
                }
            },
        });
        res.status(httpStatus_1.default.CREATED).json({ message: 'Reciclaje confirmado', transactionId: transaction.id });
    }
    catch (error) {
        console.error('Error al confirmar reciclaje:', error);
        res.status(httpStatus_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Error al procesar la solicitud' });
    }
};
exports.confirmRecycling = confirmRecycling;
