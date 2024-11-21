import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

// Obtener cupones
export const getCoupons = async (req: Request, res: Response): Promise<void> => { 
  if (!req.user) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Usuario no autenticado" });
    return; // Termina la ejecución aquí
  }

  const userId = parseInt(req.user.id, 10); // Autenticación del usuario

  try {
    const coupons = await prisma.coupon.findMany({
      where: {
        userId: null, // Aún no canjeados
        expirationDate: {
          gte: new Date(), // Cupones no expirados
        },
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Usuario no encontrado" });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      availablePoints: user.points,
      coupons,
    });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error al obtener cupones" });
  }
};

// Canjear cupones
export const redeemCoupon = async (req: Request, res: Response): Promise<void> => { 
  if (!req.user) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Usuario no autenticado" });
    return;
  }

  console.log(req.user);
  console.log("solicitud recibida para el canje de cupon ", req.body);

  const { couponCode } = req.body;
  const userId = parseInt(req.user.id, 10); // ahora sabemos que req.user no es undefined

  try {
    // Buscar el cupón
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode },
    });

    console.log("cupon encontrado", coupon);

    if (!coupon || new Date(coupon.expirationDate) < new Date()) {
      console.log("cupon no valido o expirado");
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Cupón no válido o expirado" });
      return;
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("usuario encontrado", user);

    if (!user) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Usuario no encontrado" });
      return;
    }

    if (user.points < coupon.discountValue) {
      console.log("puntos insuficientes");
      res.status(HTTP_STATUS.BAD_REQUEST).json({ message: "Puntos insuficientes" });
      return;
    }

    // Transacción para restar puntos y canjear el cupón
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { points: user.points - coupon.discountValue },
      }),
      prisma.coupon.update({
        where: { id: coupon.id },
        data: { userId: userId },
      }),
    ]);

    console.log("canje de puntos exitoso");
    res.status(HTTP_STATUS.OK).json({ message: "Cupón canjeado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: "Error al canjear cupón" });
  }
};
