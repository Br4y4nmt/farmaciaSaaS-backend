import { Router } from "express";

import authRoutes from "#domains/auth/routes";
import roleRoutes from "#domains/roles/routes";
import empresasRoutes from "#domains/empresas/routes";
import planesRoutes from "#domains/planes/routes";
const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);
router.use("/empresas", empresasRoutes);
router.use("/planes", planesRoutes);

export default router;