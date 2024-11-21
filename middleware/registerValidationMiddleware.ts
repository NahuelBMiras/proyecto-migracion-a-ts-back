import Joi from "joi";
import HTTP_STATUS from "../helpers/httpStatus";
import { Request, Response, NextFunction } from "express";

// Aseguramos que la función retorna void
export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    // En caso de error, respondemos con el mensaje
    res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.details[0].message });
    return;  // Importante: no llamamos a next() si hay error
  }

  next();  // Si no hay error, pasamos al siguiente middleware
};