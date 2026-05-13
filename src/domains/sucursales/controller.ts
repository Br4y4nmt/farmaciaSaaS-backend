import { Request, Response } from "express";

export const getSucursales = async (
  req: Request,
  res: Response
) => {
  try {
    res.json({
      ok: true,
      message: "Lista de sucursales",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener sucursales",
    });
  }
};