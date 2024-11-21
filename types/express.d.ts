import { Request } from "express";

declare module "express" {
  export interface Request {
    user?: {
      id: string;        // Aquí accedes a 'user.id' en lugar de 'userId'
      email: string;
      roles: string[];
    };
  }
}