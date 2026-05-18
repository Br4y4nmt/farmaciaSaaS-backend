import { Router } from "express";
import { createUsuario } from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  createUsuario
);

export default router;