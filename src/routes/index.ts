import { Router } from "express";

import authRoutes from "#domains/auth/routes";
import roleRoutes from "#domains/roles/routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/roles", roleRoutes);

export default router;