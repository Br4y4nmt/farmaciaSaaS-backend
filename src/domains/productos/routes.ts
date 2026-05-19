import { Router } from "express";
import {
	getProductos,
	getProductoById,
	createProducto,
	updateProducto,
	deleteProducto,
} from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

// Obtener productos
router.get(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	getProductos
);

// Obtener producto por ID
router.get(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	getProductoById
);

// Crear producto
router.post(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	createProducto
);

// Editar producto
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	updateProducto
);

// Eliminar producto
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	deleteProducto
);

export default router;
