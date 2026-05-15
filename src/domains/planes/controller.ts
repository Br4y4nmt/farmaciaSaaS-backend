import { Request, Response } from "express";
import Plan from "./model";

export const getPlanes = async (_req: Request, res: Response) => {
  try {
    const planes = await Plan.findAll({
      where: {
        estado: true,
      },
      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      ok: true,
      planes,
    });
  } catch (error) {
    console.error("Error getPlanes:", error);

    return res.status(500).json({
      ok: false,
      message: "Error al obtener los planes",
    });
  }
};