import { Router } from "express";

import uploadValidator from "../validators/upload.validator.js";
import uploadController from "../controllers/upload.controller.js";
import uploadMiddleware from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
    "/upload",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    uploadMiddleware.uploadImage,
    uploadValidator.uploadImageValidator,
    uploadController.uploadImage
);

export default router;
