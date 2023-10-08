import { Router } from "express";

import userValidator from "../validators/user.validator.js";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkOwnership from "../middlewares/ownership.middleware.js";
import queryValidationMiddleware from "../middlewares/validation.middleware.js";

const router = Router();

router.get("/users", userController.getAllUsers);

router.get("/users/:id", userController.getUserById);

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
