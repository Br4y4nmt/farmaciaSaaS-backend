import { Router } from "express";
import { getEmpresas } from "./controller";

const router = Router();

router.get("/", getEmpresas);

export default router;