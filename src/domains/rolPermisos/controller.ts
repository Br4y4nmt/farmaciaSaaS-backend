import { Request, Response } from "express";

export const getRolPermisos = async (
  req: Request,
  res: Response
) => {
  try {
    res.json({
      ok: true,
      message: "Lista rol permisos",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error",
    });
  }
};