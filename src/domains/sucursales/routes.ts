import { Router } from "express";
import {
  createSucursal,
  getSucursales,
  updateSucursal,
  deleteSucursal,
} from "./controller"
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

// Obtener sucursales
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  getSucursales
);

// Crear sucursal
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  createSucursal
);

// Editar sucursal
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  updateSucursal
);

// Eliminar sucursal - soft delete
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN", "ADMIN_EMPRESA"]),
  deleteSucursal
);

export default router;