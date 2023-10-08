import { Router } from "express";

import commentController from "../controllers/comment.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkOwnership from "../middlewares/ownership.middleware.js";

const router = Router({ mergeParams: true });

router.get("/comments", commentController.getAllComments);

router.get("/comments/:id", commentController.getCommentById);

router.post(
    "/comments",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    commentController.createComment
);

router.put(
    "/comments/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("comment"),
    commentController.updateCommentById
);

router.patch(
    "/comments/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("comment"),
    commentController.partiallyUpdateCommentById
);

router.delete(
    "/comments/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin", "user"]),
    checkOwnership("comment"),
    commentController.deleteCommentById
);

export default router;
