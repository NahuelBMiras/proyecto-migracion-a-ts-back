import { PrismaClient, User } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";
import type { Request, Response } from "express"

interface AddPointsRequestBody {
  userId: string;
  points: number;
  weights: { [key: string]: string };  // `weights` es un objeto con claves como string y valores como string (que representan números)
}

const prisma = new PrismaClient();

export const searchUser = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, points: true }
    });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    return res.status(HTTP_STATUS.OK).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error al buscar usuario" });
  }
};

export const addPoints = async (req: Request, res: Response) => {
  const { userId, points, weights }: AddPointsRequestBody = req.body;

  // Validar que req.user tiene el tipo correcto y que no es undefined
  if (!req.user || typeof req.user.id !== 'string') {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Usuario no autenticado" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

    if (!user) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Usuario no encontrado" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: { points: { increment: points } }
    });

    // Validar y filtrar weights: asegurarse de que los valores sean números válidos
    const validWeights = Object.entries(weights).filter(([material, weight]) => {
      const parsedWeight = parseFloat(weight);
      return !isNaN(parsedWeight) && parsedWeight > 0;
    });

    // Función para verificar si el material es válido
function isValidMaterial(material: string): material is Material {
  return ['cardboard', 'glass', 'paper', 'metal', 'plastic'].includes(material);
}

const transaction = await prisma.transaction.create({
  data: {
    userId: Number(userId),
    adminId: Number((req.user as { id: string }).id), // Aseguramos el tipo correcto
    totalPoints: points,
    state: true,
    details: {
      create: validWeights.map(([material, weight]) => {
        const parsedWeight = parseFloat(weight);  // Convertimos el weight a número

        // Validamos si el material es válido antes de usarlo
        if (!isValidMaterial(material)) {
          throw new Error(`Material inválido: ${material}`);
        }

        return {
          materialId: getMaterialId(material), // Ahora `material` es de tipo `Material`
          weight: parsedWeight,  // Usamos el weight como número
          points: Math.ceil(parsedWeight * getPointsPerKg(material))  // Calculamos los puntos
        };
      })
    }
  }
});

    return res.status(HTTP_STATUS.OK).json({
      message: "Puntos agregados exitosamente",
      user: { id: updatedUser.id, email: updatedUser.email, points: updatedUser.points },
      transaction: { id: transaction.id, totalPoints: transaction.totalPoints }
    });
  } catch (error) {
    console.error(error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error al agregar puntos" });
  }
};

type Material = 'cardboard' | 'glass' | 'paper' | 'metal' | 'plastic';

// Ajustamos las funciones para usar el tipo `Material`
function getMaterialId(material: Material): number {
  const materialIds: { [key in Material]: number } = {
    cardboard: 1,
    glass: 2,
    paper: 3,
    metal: 4,
    plastic: 5
  };
  return materialIds[material];
}

function getPointsPerKg(material: Material): number {
  const pointsPerKg: { [key in Material]: number } = {
    cardboard: 10,
    glass: 5,
    paper: 8,
    metal: 15,
    plastic: 12
  };
  return pointsPerKg[material];
}