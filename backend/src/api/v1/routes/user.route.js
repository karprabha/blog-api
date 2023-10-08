import { Router } from "express";

import userController from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkOwnership from "../middlewares/ownership.middleware.js";

const router = Router();

router.get("/users", userController.getAllUsers);

router.get("/users/:id", userController.getUserById);

router.post("/users", userController.createUser);

router.put(
    "/users/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("user"),
    userController.updateUserById
);

router.patch(
    "/users/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("user"),
    userController.partiallyUpdateUserById
);

router.delete(
    "/users/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("user"),
    userController.deleteUserById
);

export default router;
