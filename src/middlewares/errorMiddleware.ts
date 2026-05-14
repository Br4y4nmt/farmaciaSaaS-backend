import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
  expose?: boolean;
}

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status ?? 500;
  const message = err.expose ? err.message : "Error interno del servidor";

  console.error(`[${req.method}] ${req.path} →`, err.message);

  return res.status(status).json({
    ok: false,
    message,
  });
};

export default errorMiddleware;