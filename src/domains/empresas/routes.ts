import { Router } from "express";
import {
  getEmpresas,
  createEmpresa,
  updateEmpresa,
  getEmpresasUsuariosResumen,
  deleteEmpresa,
  updateEmpresaSubscription,
} from "./controller";

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

// Obtener resumen de usuarios por empresa (solo para SUPER_ADMIN)
router.get(
  "/usuarios-resumen",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  getEmpresasUsuariosResumen
);

// Editar empresa
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  updateEmpresa
);

// Editar suscripción de empresa
router.patch(
  "/:id/subscription",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  updateEmpresaSubscription
);

// Eliminar empresa
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  deleteEmpresa
);

export default router;