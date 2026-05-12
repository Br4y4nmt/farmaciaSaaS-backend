import { Request, Response } from "express";

export const getRoles = async (req: Request, res: Response) => {
  try {
    res.json({
      ok: true,
      message: "Lista de roles",
      data: [],
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener roles",
    });
  }
};