import { Router } from "express";
import { getPlanes, createPlan } from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

// Crear nuevo plan
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  createPlan
);

// Obtener todos los planes
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  getPlanes
);

export default router;