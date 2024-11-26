export interface CustomJwtPayload {
    id: string;        // El ID del usuario (como string)
    email: string;     // El correo electrónico del usuario
    roles: string[];   // Lista de roles del usuario
  }