import { PrismaClient } from "@prisma/client";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/tokenManagement";
import HTTP_STATUS from "../helpers/httpStatus";
import { Request, Response } from "express";

const prisma = new PrismaClient();

// Definimos los tipos del cuerpo de la solicitud para la función `register`
interface RegisterRequestBody {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Registro de usuario
export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response
): Promise<void> => {  // Retornamos `Promise<void>`
  console.log('Método de la solicitud:', req.method);
  console.log('Datos recibidos:', req.body);
  const { name, username, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: "Las contraseñas no coinciden" });
    return;  // Aseguramos que no se continúe ejecutando el código después de responder
  }

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: "Se registrado exitosamente" });
      return;
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

    res
      .status(HTTP_STATUS.CREATED)
      .json({ message: "Usuario registrado exitosamente", user: newUser });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: "Error al registrar usuario", error });
  }
};

// Definimos los tipos del cuerpo de la solicitud para la función `login`
interface LoginRequestBody {
  email: string;
  password: string;
}

// Login de usuario
export const login = async (
  req: Request<{}, {}, LoginRequestBody>,
  res: Response
): Promise<void> => {  // Retornamos `Promise<void>`
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Credenciales incorrectas" });
      return;
    }

    const validPassword = await comparePassword(password, user.password);
    if (!validPassword) {
      res
        .status(HTTP_STATUS.UNAUTHORIZED)
        .json({ message: "Credenciales incorrectas" });
      return;
    }

    const token = generateToken(user);

    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Tokens generados", token, userId: user.id, role: user.role });
  } catch (error) {
    if (error instanceof Error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Error al iniciar sesión", error: error.message });
    } else {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: "Error desconocido", error });
    }
  }
};
