import { Router } from "express";

import userController from "../controllers/user.controller.js";

const router = Router();

router.get("/users", userController.getAllUsers);

router.get("/users/:id", userController.getUserById);

export default router;
