import { Router } from "express";
import { getUsuarios } from "./controller";

const router = Router();

router.get("/", getUsuarios);

export default router;