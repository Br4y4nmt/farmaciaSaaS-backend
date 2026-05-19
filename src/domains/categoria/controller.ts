import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Categoria from "./model";
import Empresa from "#domains/empresas/model";

const parseNumberParam = (value?: string) => {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	const parsed = Number(value);

	return Number.isNaN(parsed) ? null : parsed;
};

// Obtener categorias
export const getCategorias = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			page = "1",
			limit = "10",
			empresa_id,
			parent_id,
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

		const parentIdParsed = parseNumberParam(parent_id);
		if (parent_id !== undefined && parentIdParsed === null) {
			return res.status(400).json({ ok: false, message: "parent_id inválido" });
		}
		if (parentIdParsed !== null) {
			where.parent_id = parentIdParsed;
		}

		if (estado !== undefined) {
			where.estado = estado === "true";
		}

		if (nombre) {
			where.nombre = { [Op.like]: `%${nombre}%` };
		}

		const { count, rows } = await Categoria.findAndCountAll({
			where,
			include: [
				{
					model: Categoria,
					as: "categoria_padre",
					attributes: ["id", "nombre"],
					required: false,
				},
			],
			order: [
				["orden", "ASC"],
				["created_at", "DESC"],
			],
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
				categorias: rows,
			},
		});
	} catch (error) {
		next(error);
	}
};

// Obtener categorias raiz (parent_id = null)
export const getCategoriasRaiz = async (
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
		const where: any = {
			parent_id: null,
		};

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

		const { count, rows } = await Categoria.findAndCountAll({
			where,
			order: [
				["orden", "ASC"],
				["created_at", "DESC"],
			],
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
				categorias: rows,
			},
		});
	} catch (error) {
		next(error);
	}
};

// Crear categoria
export const createCategoria = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			empresa_id,
			parent_id,
			nombre,
			descripcion,
			orden,
			estado,
		} = req.body;

		if (!empresa_id || !nombre) {
			return res.status(400).json({
				ok: false,
				message: "empresa_id y nombre son obligatorios",
			});
		}

		if (orden !== undefined && Number.isNaN(Number(orden))) {
			return res.status(400).json({
				ok: false,
				message: "orden debe ser un número",
			});
		}

		const empresa = await Empresa.findByPk(empresa_id);

		if (!empresa) {
			return res.status(404).json({ ok: false, message: "La empresa no existe" });
		}

		if (parent_id) {
			const categoriaPadre = await Categoria.findOne({
				where: {
					id: parent_id,
					empresa_id,
				},
			});

			if (!categoriaPadre) {
				return res.status(404).json({
					ok: false,
					message: "La categoria padre no existe o no pertenece a la empresa",
				});
			}
		}


		const categoria = await Categoria.create({
			empresa_id,
			parent_id: parent_id ?? null,
			nombre,
			descripcion: descripcion ?? null,
			orden: orden ?? 0,
			estado: estado ?? true,
		});

		return res.status(201).json({
			ok: true,
			message: "Categoria creada correctamente",
			data: categoria,
		});
	} catch (error) {
		next(error);
	}
};

// Actualizar categoria
export const updateCategoria = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const categoria = await Categoria.findByPk(id);

		if (!categoria) {
			return res.status(404).json({ ok: false, message: "Categoria no encontrada" });
		}

		const {
			empresa_id,
			parent_id,
			nombre,
			descripcion,
			orden,
			estado,
		} = req.body;

		if (orden !== undefined && Number.isNaN(Number(orden))) {
			return res.status(400).json({
				ok: false,
				message: "orden debe ser un número",
			});
		}

		if (empresa_id !== undefined && empresa_id !== null) {
			const empresa = await Empresa.findByPk(empresa_id);

			if (!empresa) {
				return res.status(404).json({ ok: false, message: "La empresa no existe" });
			}
		}

		if (parent_id !== undefined && parent_id !== null) {
			if (Number(parent_id) === id) {
				return res.status(400).json({
					ok: false,
					message: "parent_id no puede ser igual al id",
				});
			}

			const empresaIdParaValidar = empresa_id ?? categoria.getDataValue("empresa_id");
			const categoriaPadre = await Categoria.findOne({
				where: {
					id: parent_id,
					empresa_id: empresaIdParaValidar,
				},
			});

			if (!categoriaPadre) {
				return res.status(404).json({
					ok: false,
					message: "La categoria padre no existe o no pertenece a la empresa",
				});
			}
		}

		await categoria.update({
			empresa_id: empresa_id ?? categoria.getDataValue("empresa_id"),
			parent_id: parent_id ?? categoria.getDataValue("parent_id"),
			nombre: nombre ?? categoria.getDataValue("nombre"),
			descripcion: descripcion ?? categoria.getDataValue("descripcion"),
			orden: orden ?? categoria.getDataValue("orden"),
			estado: estado !== undefined ? estado : categoria.getDataValue("estado"),
		});

		return res.status(200).json({
			ok: true,
			message: "Categoria actualizada correctamente",
			data: categoria,
		});
	} catch (error) {
		next(error);
	}
};

// Eliminar categoria (soft delete)
export const deleteCategoria = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const categoria = await Categoria.findByPk(id);

		if (!categoria) {
			return res.status(404).json({ ok: false, message: "Categoria no encontrada" });
		}

		await Categoria.destroy({
			where: {
				parent_id: id,
			},
		});
		await categoria.destroy();

		return res.status(200).json({
			ok: true,
			message: "Categoria eliminada correctamente",
		});
	} catch (error) {
		next(error);
	}
};
