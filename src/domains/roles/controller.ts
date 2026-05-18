import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Role from "./model";

export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await Role.findAll({
      where: {
        codigo: {
          [Op.ne]: "SUPER_ADMIN",
        },
      },

      attributes: [
        "id",
        "codigo",
        "nombre",
      ],

      order: [["id", "ASC"]],
    });

    return res.status(200).json({
      ok: true,
      data: roles,
    });

  } catch (error) {
    next(error);
  }
};