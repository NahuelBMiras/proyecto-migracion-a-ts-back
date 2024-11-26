import { PrismaClient } from '@prisma/client';
import HTTP_STATUS from '../helpers/httpStatus';
import type { Request, Response } from 'express';
import { CustomRequest } from '../@types/express';

const prisma = new PrismaClient();

interface Material {
  id: number;
}

export const confirmRecycling = async (req: CustomRequest, res: Response) => {
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
          create: materials.map((material: Material) => ({
            materialId: material.id,
          }))
        }
      },
    });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Reciclaje confirmado', transactionId: transaction.id });
  } catch (error) {
    console.error('Error al confirmar reciclaje:', error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: 'Error al procesar la solicitud' });
  }
};
