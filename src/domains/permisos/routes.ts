import { Router } from "express";
import { getPermisos } from "./controller";

const router = Router();

router.get("/", getPermisos);

export default router;