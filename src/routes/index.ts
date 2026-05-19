import { Router } from "express";

import authRoutes from "#domains/auth/routes";
import roleRoutes from "#domains/roles/routes";
import empresasRoutes from "#domains/empresas/routes";
import planesRoutes from "#domains/planes/routes";
import usuariosRoutes from "#domains/usuarios/routes";
import sucursalesRoutes from "#domains/sucursales/routes";
import productosRoutes from "#domains/productos/routes";
import categoriasRoutes from "#domains/categoria/routes";
import laboratoriosRoutes from "#domains/laboratorios/routes";
import marcasRoutes from "#domains/marcas/routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/empresas", empresasRoutes);
router.use("/planes", planesRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/sucursales", sucursalesRoutes);
router.use("/productos", productosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/laboratorios", laboratoriosRoutes);
router.use("/marcas", marcasRoutes);

export default router;