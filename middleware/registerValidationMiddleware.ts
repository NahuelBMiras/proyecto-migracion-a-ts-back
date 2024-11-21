import Joi from "joi";
import HTTP_STATUS from "../helpers/httpStatus";
import { Request, Response, NextFunction } from "express"; 

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    username: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: error.details[0].message });
  }

  next();
};
