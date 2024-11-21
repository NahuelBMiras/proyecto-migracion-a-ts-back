import { PrismaClient } from "@prisma/client";
import HTTP_STATUS from "../helpers/httpStatus.js";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

// obtener cupones 
export const getCoupons = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Usuario no autenticado" });
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
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Usuario no encontrado" });
    }

    return res.status(HTTP_STATUS.OK).json({
      availablePoints: user.points,
      coupons,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al obtener cupones" });
  }
};

// canjear cupones
export const redeemCoupon = async (req: Request, res: Response) => {
  if (!req.user) {
    return res
      .status(HTTP_STATUS.UNAUTHORIZED)
      .json({ message: "Usuario no autenticado" });
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
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Cupón no válido o expirado" });
    }

    // Obtener el usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log("usuario encontrado", user);

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Usuario no encontrado" });
    }

    if (user.points < coupon.discountValue) {
      console.log("puntos insuficientes");
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Puntos insuficientes" });
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
    return res
      .status(HTTP_STATUS.OK)
      .json({ message: "Cupón canjeado con éxito" });
  } catch (error) {
    console.error(error);
    return res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al canjear cupón" });
  }
};