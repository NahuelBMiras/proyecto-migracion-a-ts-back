import { CustomJwtPayload } from "./types/types"; // Asegúrate de que la ruta sea correcta
import { Request } from "express";


export interface CustomRequest extends Request {
  user?: CustomJwtPayload; // Aquí estamos utilizando la interfaz CustomJwtPayload
}
