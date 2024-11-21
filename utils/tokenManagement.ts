import { BodyUserType } from "@/types/user";
import jwt from "jsonwebtoken";

type IdParams = {
  id: number
}

export const generateToken = (user: BodyUserType & IdParams) => {
  // Convertir BigInt a string
  const userId = user.id.toString();
  return jwt.sign({ id: userId, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
