import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Laboratorio from "./model";
import Empresa from "#domains/empresas/model";

const parseNumberParam = (value?: string) => {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	const parsed = Number(value);

	return Number.isNaN(parsed) ? null : parsed;
};

// Obtener laboratorios
export const getLaboratorios = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			page = "1",
			limit = "10",
			empresa_id,
			estado,
			nombre,
		} = req.query as Record<string, string>;

		const pageNumber = Math.max(1, parseInt(page, 10));
		const limitNumber = Math.min(100, Math.max(1, parseInt(limit, 10)));
		const offset = (pageNumber - 1) * limitNumber;
		const where: any = {};

		const empresaIdParsed = parseNumberParam(empresa_id);
		if (empresa_id !== undefined && empresaIdParsed === null) {
			return res.status(400).json({ ok: false, message: "empresa_id inválido" });
		}
		if (empresaIdParsed !== null) {
			where.empresa_id = empresaIdParsed;
		}

		if (estado !== undefined) {
			where.estado = estado === "true";
		}

		if (nombre) {
			where.nombre = { [Op.like]: `%${nombre}%` };
		}

		const { count, rows } = await Laboratorio.findAndCountAll({
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
				laboratorios: rows,
			},
		});
	} catch (error) {
		next(error);
	}
};

// Crear laboratorio
export const createLaboratorio = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { empresa_id, nombre, codigo, descripcion, estado } = req.body;

		if (!empresa_id || !nombre) {
			return res.status(400).json({
				ok: false,
				message: "empresa_id y nombre son obligatorios",
			});
		}

		const empresa = await Empresa.findByPk(empresa_id);

		if (!empresa) {
			return res.status(404).json({ ok: false, message: "La empresa no existe" });
		}

		const laboratorio = await Laboratorio.create({
			empresa_id,
			nombre,
			codigo: codigo ?? null,
			descripcion: descripcion ?? null,
			estado: estado ?? true,
		});

		return res.status(201).json({
			ok: true,
			message: "Laboratorio creado correctamente",
			data: laboratorio,
		});
	} catch (error) {
		next(error);
	}
};

// Actualizar laboratorio
export const updateLaboratorio = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const laboratorio = await Laboratorio.findByPk(id);

		if (!laboratorio) {
			return res.status(404).json({ ok: false, message: "Laboratorio no encontrado" });
		}

		const { empresa_id, nombre, codigo, descripcion, estado } = req.body;

		if (empresa_id !== undefined && empresa_id !== null) {
			const empresa = await Empresa.findByPk(empresa_id);

			if (!empresa) {
				return res.status(404).json({ ok: false, message: "La empresa no existe" });
			}
		}

		await laboratorio.update({
			empresa_id: empresa_id ?? laboratorio.getDataValue("empresa_id"),
			nombre: nombre ?? laboratorio.getDataValue("nombre"),
			codigo: codigo ?? laboratorio.getDataValue("codigo"),
			descripcion: descripcion ?? laboratorio.getDataValue("descripcion"),
			estado: estado !== undefined ? estado : laboratorio.getDataValue("estado"),
		});

		return res.status(200).json({
			ok: true,
			message: "Laboratorio actualizado correctamente",
			data: laboratorio,
		});
	} catch (error) {
		next(error);
	}
};

// Eliminar laboratorio (soft delete)
export const deleteLaboratorio = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const laboratorio = await Laboratorio.findByPk(id);

		if (!laboratorio) {
			return res.status(404).json({ ok: false, message: "Laboratorio no encontrado" });
		}

		await laboratorio.update({ estado: false });

		return res.status(200).json({
			ok: true,
			message: "Laboratorio eliminado correctamente",
		});
	} catch (error) {
		next(error);
	}
};
