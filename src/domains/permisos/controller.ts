import { Request, Response } from "express";

export const getPermisos = async (
  req: Request,
  res: Response
) => {
  try {
    res.json({
      ok: true,
      message: "Lista de permisos",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener permisos",
    });
  }
};