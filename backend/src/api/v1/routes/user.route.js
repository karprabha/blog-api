import { Router } from "express";

import User from "../models/user.js";

import userValidator from "../validators/user.validator.js";
import paginate from "../middlewares/pagination.middleware.js";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkOwnership from "../middlewares/ownership.middleware.js";
import visibilityMiddleware from "../middlewares/visibility.middleware.js";
import queryValidationMiddleware from "../middlewares/validation.middleware.js";

const router = Router();

router.get("/users", paginate(User), userController.getAllUsers);

router.get(
    "/users/:id",
    visibilityMiddleware.checkVisibility(["admin", "user"], "user"),
    userController.getUserById
);

router.post(
    "/users",
    userValidator.createUserValidator,
    queryValidationMiddleware,
    userController.createUser
);

router.put(
    "/users/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("user"),
    userValidator.updateUserValidator,
    queryValidationMiddleware,
    userController.updateUserById
);

router.patch(
    "/users/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("user"),
    userValidator.partiallyUpdateUserValidator,
    queryValidationMiddleware,
    userController.partiallyUpdateUserById
);

router.delete(
    "/users/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("user"),
    userValidator.deleteUserValidator,
    queryValidationMiddleware,
    userController.deleteUserById
);

export default router;
