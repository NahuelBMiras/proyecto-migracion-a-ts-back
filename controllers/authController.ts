import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/tokenManagement.js";
import HTTP_STATUS from "../helpers/httpStatus.js";
import type { Request, Response } from "express";  // Importamos los tipos de Express

const prisma = new PrismaClient();

// Registro de usuario
export const register = async (req: Request, res: Response) => {
  console.log('Método de la solicitud:', req.method);
  console.log('Datos recibidos:', req.body);
  const { name, username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Las contraseñas no coinciden" });
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Se registrado exitosamente" });
    }

    const hashedPassword = await hashPassword(password);

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
    return res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    if (error instanceof Error) {  // Verificamos si el error es una instancia de Error
      console.log(error.message);  // Accedemos al mensaje del error
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al registrar usuario", error: error.message });
    } else {
      // Si el error no es una instancia de Error, lo manejamos de otra forma
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Error desconocido", error });
    }
  }
};
