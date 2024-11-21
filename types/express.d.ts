import { Request } from "express";
import { CustomJwtPayload } from "./types/types"; // Importa la interfaz CustomJwtPayload correctamente

declare global {
  namespace Express {
    interface Request {
      user?: CustomJwtPayload; // Ahora req.user tiene el tipo CustomJwtPayload
    }
  }
}

declare module "express" {
  export interface Request {
    user?: {
      id: string;        // Aquí accedes a 'user.id' en lugar de 'userId'
      email: string;
      roles: string[];
    };
  }
}