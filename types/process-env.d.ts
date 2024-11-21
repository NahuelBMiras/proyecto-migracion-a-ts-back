import { Secret } from "jsonwebtoken";

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        [key: string]: string | undefined;
        PORT: number;
        DATABASE_URL: string;
        JWT_SECRET: Secret;
        COHERE_API_KEY: string
      }
    }
  }
  