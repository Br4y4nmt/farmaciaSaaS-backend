import { Request, Response, NextFunction } from "express";

const roleMiddleware = (
  roles: string[]
) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          ok: false,
          message: "No autorizado",
        });
      }

      if (!roles.includes(user.rol)) {
        return res.status(403).json({
          ok: false,
          message: "Sin permisos",
        });
      }

      next();

    } catch (error) {
      return res.status(500).json({
        ok: false,
        message: "Error de autorización",
      });
    }
  };
};

export default roleMiddleware;