import { Router } from "express";
import {
	getCategorias,
	getCategoriasRaiz,
	createCategoria,
	updateCategoria,
	deleteCategoria,
} from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

// Obtener categorias
router.get(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	getCategorias
);

// Obtener categorias raiz
router.get(
	"/raiz",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	getCategoriasRaiz
);

// Crear categoria
router.post(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	createCategoria
);

// Editar categoria
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	updateCategoria
);

// Eliminar categoria
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	deleteCategoria
);

export default router;
