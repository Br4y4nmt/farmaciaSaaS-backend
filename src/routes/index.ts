import { Router } from "express";

import roleRoutes from "#domains/roles/routes";

const router = Router();

router.use("/roles", roleRoutes);

export default router;