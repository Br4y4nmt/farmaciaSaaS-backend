import { Router } from "express";
import { getEmpresas, createEmpresa, updateEmpresa, deleteEmpresa }from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();


// Obtener todas las empresas (solo para SUPER_ADMIN)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  getEmpresas
);

// Crear empresa 
router.post(
	"/",
	authMiddleware,
	roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
	createEmpresa
);

// Editar empresa
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  updateEmpresa
);

// Eliminar empresa (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  deleteEmpresa
);

export default router;