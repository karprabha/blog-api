import { Router } from "express";

import authController from "../controllers/auth.controller.js";

const router = Router();

router.post("/auth/login", authController.login);

router.post("/auth/logout", authController.logout);

router.post("/auth/refresh", authController.refreshAccessToken);

export default router;
