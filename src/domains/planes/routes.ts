import { Router } from "express";
import { getPlanes } from "./controller";
import authMiddleware from "#middlewares/authMiddleware";
import roleMiddleware from "#middlewares/roleMiddleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  roleMiddleware(["SUPER_ADMIN"]),
  getPlanes
);

export default router;