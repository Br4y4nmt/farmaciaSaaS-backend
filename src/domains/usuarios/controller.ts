import { Request, Response } from "express";

export const getUsuarios = async (
  req: Request,
  res: Response
) => {
  try {
    res.json({
      ok: true,
      message: "Lista de usuarios",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener usuarios",
    });
  }
};