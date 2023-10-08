import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import commentValidator from "../validators/comment.validator.js";
import checkOwnership from "../middlewares/ownership.middleware.js";
import commentController from "../controllers/comment.controller.js";
import queryValidationMiddleware from "../middlewares/validation.middleware.js";

const router = Router({ mergeParams: true });

router.get("/comments", commentController.getAllComments);

router.get("/comments/:id", commentController.getCommentById);

router.post(
    "/comments",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    commentValidator.createCommentValidator,
    queryValidationMiddleware,
    commentController.createComment
);

router.put(
    "/comments/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("comment"),
    commentValidator.updateCommentValidator,
    queryValidationMiddleware,
    commentController.updateCommentById
);

router.patch(
    "/comments/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("comment"),
    commentValidator.partiallyUpdateCommentValidator,
    queryValidationMiddleware,
    commentController.partiallyUpdateCommentById
);

router.delete(
    "/comments/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("comment"),
    commentValidator.deleteCommentValidator,
    queryValidationMiddleware,
    commentController.deleteCommentById
);

export default router;
