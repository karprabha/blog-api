import { Router } from "express";

import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/users", userController.getAllUsers);

router.post("/users", userController.createUser);

router.get("/users/:id", userController.getUserById);

router.put("/users/:id", userController.updateUserById);

router.patch("/users/:id", userController.partiallyUpdateUserById);

export default router;
