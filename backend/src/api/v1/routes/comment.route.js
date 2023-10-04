import { Router } from "express";

import commentController from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.get("/comments", commentController.getAllComments);

router.post("/comments", commentController.createComment);

router.get("/comments/:id", commentController.getCommentById);

router.put("/comments/:id", commentController.updateCommentById);

export default router;
