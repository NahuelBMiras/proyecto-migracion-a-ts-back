import bcrypt from "bcrypt";

// Tipo explícito para el parámetro `password`
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Tipo explícito para los parámetros `password` y `hashedPassword`
export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashedPassword);
  return result;
};