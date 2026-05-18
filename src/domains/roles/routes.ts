import { Router } from "express";
import { getRoles } from "./controller";
import authMiddleware from "#middlewares/authMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  getRoles
);

export default router;