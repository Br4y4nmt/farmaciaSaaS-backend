import { Request, Response, NextFunction } from "express";

const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "No autorizado",
      });
    }

    if (!user.rol || !roles.includes(user.rol)) {
      return res.status(403).json({
        ok: false,
        message: "Sin permisos",
      });
    }

    next();
  };
};

export default roleMiddleware;