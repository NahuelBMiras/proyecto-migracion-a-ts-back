import { verifyToken } from "../utils/tokenManagement";
import HTTP_STATUS from "../helpers/httpStatus";
import type { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../@types/express";


const userMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Token no proporcionado" });
    return; // Asegúrate de no continuar el flujo de la solicitud después de enviar la respuesta
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Token inválido" });
    return; // Lo mismo aquí, terminamos la ejecución después de enviar la respuesta
  }

  req.user = decoded; // Ahora TypeScript reconoce la propiedad `user`
  next(); // Llamamos a `next()` para que el flujo siga
};

export default userMiddleware;
