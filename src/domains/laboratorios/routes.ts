import { Router } from "express";
import {
	getLaboratorios,
	createLaboratorio,
	updateLaboratorio,
	deleteLaboratorio,
} from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

// Obtener laboratorios
router.get(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	getLaboratorios
);

// Crear laboratorio
router.post(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	createLaboratorio
);

// Editar laboratorio
router.put(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	updateLaboratorio
);

// Eliminar laboratorio
router.delete(
	"/:id",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	deleteLaboratorio
);

export default router;
