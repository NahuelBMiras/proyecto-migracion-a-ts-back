import { verifyToken } from "../utils/tokenManagement";
import HTTP_STATUS from "../helpers/httpStatus";
import type { Response, NextFunction } from "express";
import { CustomJwtPayload } from "../@types/types"; // Asegúrate de importar la interfaz correctamente
import { CustomRequest } from "../@types/express";

const userMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Token no proporcionado" });
    return; // Aquí no devolvemos nada, simplemente terminamos el flujo
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Token inválido" });
    return; // Aquí tampoco devolvemos nada, simplemente terminamos el flujo
  }

  // Tipar correctamente req.user como CustomJwtPayload
  req.user = decoded as CustomJwtPayload; // Ahora req.user tiene id, email, roles
  next(); // Llamar a next() para continuar el flujo sin retornar nada
};

export default userMiddleware;
