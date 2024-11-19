import { verifyToken } from '../utils/tokenManagement';
import HTTP_STATUS from '../helpers/httpStatus';
import type { Request, Response, NextFunction } from "express";

const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Token no proporcionado' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Token inválido' });
  }

  req.user = decoded;
  next();
};

export default userMiddleware;
