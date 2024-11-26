// utils/tokenManagement.ts
import jwt from "jsonwebtoken";
import { CustomJwtPayload } from "../@types/types"; // Asegúrate de importar desde el archivo correcto

// La función para generar el token
export const generateToken = (user: { id: number | BigInt, role: string }): string => {
  const userId = user.id.toString();
  return jwt.sign({ id: userId, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });
};

// La función para verificar el token
export const verifyToken = (token: string): CustomJwtPayload | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

