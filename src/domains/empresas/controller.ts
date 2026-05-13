import { Request, Response } from "express";

export const getEmpresas = async (
  req: Request,
  res: Response
) => {
  try {
    res.json({
      ok: true,
      message: "Lista de empresas",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener empresas",
    });
  }
};