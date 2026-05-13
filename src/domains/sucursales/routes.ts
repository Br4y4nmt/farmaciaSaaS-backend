import { Router } from "express";
import { getSucursales } from "./controller";

const router = Router();

router.get("/", getSucursales);

export default router;