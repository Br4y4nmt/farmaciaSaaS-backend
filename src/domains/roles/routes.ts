import { Router } from "express";
import { getRoles } from "./controller";

const router = Router();

router.get("/", getRoles);

export default router;