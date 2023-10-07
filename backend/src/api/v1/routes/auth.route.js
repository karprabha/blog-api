import { Router } from "express";

import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/login", authController.login);

router.post("/auth/refresh-token", authController.refreshAccessToken);

export default router;
