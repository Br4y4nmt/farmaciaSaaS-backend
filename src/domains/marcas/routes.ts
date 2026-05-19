import { Router } from "express";
import {
  getMarcas,
  createMarca,
  updateMarca,
  deleteMarca,
} from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

// Obtener marcas
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  getMarcas
);

// Crear marca
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  createMarca
);

// Editar marca
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  updateMarca
);

// Eliminar marca
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  deleteMarca
);

export default router;
