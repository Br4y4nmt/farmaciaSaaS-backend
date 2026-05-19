import { Request, Response, NextFunction } from "express";
import { Op } from "sequelize";
import Producto from "./model";
import Empresa from "#domains/empresas/model";

const TIPOS_PRODUCTO = [
	"MEDICAMENTO",
	"DISPOSITIVO_MEDICO",
	"COSMETICO",
	"SUPLEMENTO",
	"HIGIENE",
	"OTRO",
];

const parseNumberParam = (value?: string) => {
	if (value === undefined || value === null || value === "") {
		return null;
	}

	const parsed = Number(value);

	return Number.isNaN(parsed) ? null : parsed;
};

// Obtener productos
export const getProductos = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			page = "1",
			limit = "10",
			empresa_id,
			categoria_id,
			laboratorio_id,
			marca_id,
			tipo_producto,
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

		const categoriaIdParsed = parseNumberParam(categoria_id);
		if (categoria_id !== undefined && categoriaIdParsed === null) {
			return res.status(400).json({ ok: false, message: "categoria_id inválido" });
		}
		if (categoriaIdParsed !== null) {
			where.categoria_id = categoriaIdParsed;
		}

		const laboratorioIdParsed = parseNumberParam(laboratorio_id);
		if (laboratorio_id !== undefined && laboratorioIdParsed === null) {
			return res.status(400).json({ ok: false, message: "laboratorio_id inválido" });
		}
		if (laboratorioIdParsed !== null) {
			where.laboratorio_id = laboratorioIdParsed;
		}

		const marcaIdParsed = parseNumberParam(marca_id);
		if (marca_id !== undefined && marcaIdParsed === null) {
			return res.status(400).json({ ok: false, message: "marca_id inválido" });
		}
		if (marcaIdParsed !== null) {
			where.marca_id = marcaIdParsed;
		}

		if (tipo_producto) {
			if (!TIPOS_PRODUCTO.includes(tipo_producto)) {
				return res.status(400).json({ ok: false, message: "tipo_producto inválido" });
			}
			where.tipo_producto = tipo_producto;
		}

		if (estado !== undefined) {
			where.estado = estado === "true";
		}

		if (nombre) {
			where[Op.or] = [
				{ nombre_comercial: { [Op.like]: `%${nombre}%` } },
				{ nombre_generico: { [Op.like]: `%${nombre}%` } },
			];
		}

		const { count, rows } = await Producto.findAndCountAll({
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
				productos: rows,
			},
		});
	} catch (error) {
		next(error);
	}
};

// Obtener producto por ID
export const getProductoById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const producto = await Producto.findByPk(id);

		if (!producto) {
			return res.status(404).json({ ok: false, message: "Producto no encontrado" });
		}

		return res.status(200).json({ ok: true, data: producto });
	} catch (error) {
		next(error);
	}
};

// Crear producto
export const createProducto = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const {
			empresa_id,
			categoria_id,
			laboratorio_id,
			marca_id,
			codigo,
			codigo_barras,
			nombre_generico,
			nombre_comercial,
			descripcion,
			concentracion,
			presentacion,
			unidad_medida,
			principio_activo,
			tipo_producto,
			requiere_receta,
			es_controlado,
			es_fraccionable,
			precio_compra,
			precio_venta,
			stock_minimo,
			stock_maximo,
			afecto_igv,
			estado,
		} = req.body;

		if (!empresa_id || !nombre_comercial) {
			return res.status(400).json({
				ok: false,
				message: "empresa_id y nombre_comercial son obligatorios",
			});
		}

		if (tipo_producto && !TIPOS_PRODUCTO.includes(tipo_producto)) {
			return res.status(400).json({ ok: false, message: "tipo_producto inválido" });
		}

		const empresa = await Empresa.findByPk(empresa_id);

		if (!empresa) {
			return res.status(404).json({ ok: false, message: "La empresa no existe" });
		}

		const producto = await Producto.create({
			empresa_id,
			categoria_id: categoria_id ?? null,
			laboratorio_id: laboratorio_id ?? null,
			marca_id: marca_id ?? null,
			codigo: codigo ?? null,
			codigo_barras: codigo_barras ?? null,
			nombre_generico: nombre_generico ?? null,
			nombre_comercial,
			descripcion: descripcion ?? null,
			concentracion: concentracion ?? null,
			presentacion: presentacion ?? null,
			unidad_medida: unidad_medida ?? null,
			principio_activo: principio_activo ?? null,
			tipo_producto: tipo_producto ?? undefined,
			requiere_receta: requiere_receta ?? false,
			es_controlado: es_controlado ?? false,
			es_fraccionable: es_fraccionable ?? false,
			precio_compra: precio_compra ?? 0,
			precio_venta: precio_venta ?? 0,
			stock_minimo: stock_minimo ?? 0,
			stock_maximo: stock_maximo ?? 0,
			afecto_igv: afecto_igv ?? true,
			estado: estado ?? true,
		});

		return res.status(201).json({
			ok: true,
			message: "Producto creado correctamente",
			data: producto,
		});
	} catch (error) {
		next(error);
	}
};

// Actualizar producto
export const updateProducto = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const producto = await Producto.findByPk(id);

		if (!producto) {
			return res.status(404).json({ ok: false, message: "Producto no encontrado" });
		}

		const {
			empresa_id,
			categoria_id,
			laboratorio_id,
			marca_id,
			codigo,
			codigo_barras,
			nombre_generico,
			nombre_comercial,
			descripcion,
			concentracion,
			presentacion,
			unidad_medida,
			principio_activo,
			tipo_producto,
			requiere_receta,
			es_controlado,
			es_fraccionable,
			precio_compra,
			precio_venta,
			stock_minimo,
			stock_maximo,
			afecto_igv,
			estado,
		} = req.body;

		if (tipo_producto && !TIPOS_PRODUCTO.includes(tipo_producto)) {
			return res.status(400).json({ ok: false, message: "tipo_producto inválido" });
		}

		if (empresa_id !== undefined && empresa_id !== null) {
			const empresa = await Empresa.findByPk(empresa_id);

			if (!empresa) {
				return res.status(404).json({ ok: false, message: "La empresa no existe" });
			}
		}

		await producto.update({
			empresa_id: empresa_id ?? producto.getDataValue("empresa_id"),
			categoria_id: categoria_id ?? producto.getDataValue("categoria_id"),
			laboratorio_id: laboratorio_id ?? producto.getDataValue("laboratorio_id"),
			marca_id: marca_id ?? producto.getDataValue("marca_id"),
			codigo: codigo ?? producto.getDataValue("codigo"),
			codigo_barras: codigo_barras ?? producto.getDataValue("codigo_barras"),
			nombre_generico: nombre_generico ?? producto.getDataValue("nombre_generico"),
			nombre_comercial: nombre_comercial ?? producto.getDataValue("nombre_comercial"),
			descripcion: descripcion ?? producto.getDataValue("descripcion"),
			concentracion: concentracion ?? producto.getDataValue("concentracion"),
			presentacion: presentacion ?? producto.getDataValue("presentacion"),
			unidad_medida: unidad_medida ?? producto.getDataValue("unidad_medida"),
			principio_activo: principio_activo ?? producto.getDataValue("principio_activo"),
			tipo_producto: tipo_producto ?? producto.getDataValue("tipo_producto"),
			requiere_receta: requiere_receta !== undefined ? requiere_receta : producto.getDataValue("requiere_receta"),
			es_controlado: es_controlado !== undefined ? es_controlado : producto.getDataValue("es_controlado"),
			es_fraccionable: es_fraccionable !== undefined ? es_fraccionable : producto.getDataValue("es_fraccionable"),
			precio_compra: precio_compra ?? producto.getDataValue("precio_compra"),
			precio_venta: precio_venta ?? producto.getDataValue("precio_venta"),
			stock_minimo: stock_minimo ?? producto.getDataValue("stock_minimo"),
			stock_maximo: stock_maximo ?? producto.getDataValue("stock_maximo"),
			afecto_igv: afecto_igv !== undefined ? afecto_igv : producto.getDataValue("afecto_igv"),
			estado: estado !== undefined ? estado : producto.getDataValue("estado"),
		});

		return res.status(200).json({
			ok: true,
			message: "Producto actualizado correctamente",
			data: producto,
		});
	} catch (error) {
		next(error);
	}
};

// Eliminar producto (soft delete)
export const deleteProducto = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = Number(req.params.id);

		if (!id || Number.isNaN(id)) {
			return res.status(400).json({ ok: false, message: "ID inválido" });
		}

		const producto = await Producto.findByPk(id);

		if (!producto) {
			return res.status(404).json({ ok: false, message: "Producto no encontrado" });
		}

		await producto.update({ estado: false });

		return res.status(200).json({
			ok: true,
			message: "Producto eliminado correctamente",
		});
	} catch (error) {
		next(error);
	}
};
