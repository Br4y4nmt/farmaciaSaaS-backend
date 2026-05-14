import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      ok: false,
      message: "Token requerido",
    });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme?.toLowerCase() !== "bearer" || !token) {
    return res.status(401).json({
      ok: false,
      message: "Formato inválido. Use: Bearer <token>",
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error("JWT_SECRET no está definido en las variables de entorno");
    return res.status(500).json({
      ok: false,
      message: "Error de configuración del servidor",
    });
  }

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded as NonNullable<Express.Request["user"]>;
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        ok: false,
        message: "Token expirado",
      });
    }
    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        ok: false,
        message: "Token inválido",
      });
    }
    next(error);
  }
};

export default authMiddleware;