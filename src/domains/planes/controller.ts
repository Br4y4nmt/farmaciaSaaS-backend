import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Plan from "./model";


// Crear nuevo plan
export const createPlan = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nombre,
      descripcion,
      precio_mensual,
      precio_anual,
      max_sucursales,
      max_usuarios,
      max_productos,
      max_comprobantes_mensuales,
      incluye_soporte,
      incluye_facturacion,
      incluye_reportes,
      incluye_multi_sucursal,
      incluye_backup,
      estado,
    } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        ok: false,
        message: "El nombre del plan es obligatorio",
      });
    }

    const existePlan = await Plan.findOne({
      where: { nombre },
    });

    if (existePlan) {
      return res.status(409).json({
        ok: false,
        message: "Ya existe un plan con ese nombre",
      });
    }

    const plan = await Plan.create({
      nombre: nombre.trim(),
      descripcion: descripcion || null,
      precio_mensual: precio_mensual || 0,
      precio_anual: precio_anual || 0,
      max_sucursales: max_sucursales || null,
      max_usuarios: max_usuarios || null,
      max_productos: max_productos || null,
      max_comprobantes_mensuales: max_comprobantes_mensuales || null,
      incluye_soporte: incluye_soporte ?? false,
      incluye_facturacion: incluye_facturacion ?? false,
      incluye_reportes: incluye_reportes ?? true,
      incluye_multi_sucursal: incluye_multi_sucursal ?? false,
      incluye_backup: incluye_backup ?? false,
      estado: estado ?? true,
    });

    return res.status(201).json({
      ok: true,
      message: "Plan creado correctamente",
      data: plan,
    });
  } catch (error) {
    next(error);
  }
};


// Obtener planes con paginación y filtros
export const getPlanes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = "1",
      limit = "10",
      nombre,
      estado,
    } = req.query as Record<string, string>;

    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
    const offset = (pageNumber - 1) * limitNumber;

    const where: Record<string, any> = {};

    if (nombre) {
      where.nombre = {
        [Op.like]: `%${nombre}%`,
      };
    }

    if (estado !== undefined) {
      where.estado = estado === "true";
    }

    const { count, rows } = await Plan.findAndCountAll({
      where,
      order: [["created_at", "DESC"]],
      limit: limitNumber,
      offset,
    });

    return res.status(200).json({
      ok: true,
      data: {
        total: count,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(count / limitNumber),
        planes: rows,
      },
    });
  } catch (error) {
    next(error);
  }
};