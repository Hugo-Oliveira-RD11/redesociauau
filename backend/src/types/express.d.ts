// src/types/express/index.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface UserPayload {
      id_usuario: string;
      email: string;
      // adicione outros campos do token, se houver
    }

    interface Request {
      user?: UserPayload;
    }
  }
}
