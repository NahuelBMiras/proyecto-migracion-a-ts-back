import HTTP_STATUS from '../helpers/httpStatus';
import type { Request, Response, NextFunction } from "express";
import { CustomRequest } from '../@types/express';

const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.roles.includes('admin')) {
    next();
  } else {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Acceso denegado. Solo para administradores.' });
  }
};

export default adminMiddleware;