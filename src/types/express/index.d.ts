import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & {
        id: number;
        rol_id: number;
        rol: string;
        empresa_id: number;
      };
    }
  }
}

export {};