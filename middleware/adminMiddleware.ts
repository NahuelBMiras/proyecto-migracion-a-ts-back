import HTTP_STATUS from '../helpers/httpStatus';
import type { Request, Response, NextFunction } from "express";

const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Acceso denegado. Solo para administradores.' });
  }
};

export default adminMiddleware;
