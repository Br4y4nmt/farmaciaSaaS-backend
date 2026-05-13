import { Router } from "express";
import { getRolPermisos } from "./controller";

const router = Router();

router.get("/", getRolPermisos);

export default router;