import { Router } from "express";

import authValidator from "../validators/auth.validator.js";
import authController from "../controllers/auth.controller.js";
import queryValidationMiddleware from "../middlewares/validation.middleware.js";

const router = Router();

router.post(
    "/auth/login",
    authValidator.loginValidator,
    queryValidationMiddleware,
    authController.login
);

router.post(
    "/auth/logout",
    authValidator.logoutValidator,
    queryValidationMiddleware,
    authController.logout
);

router.post(
    "/auth/refresh",
    authValidator.refreshAccessTokenValidator,
    queryValidationMiddleware,
    authController.refreshAccessToken
);

export default router;
