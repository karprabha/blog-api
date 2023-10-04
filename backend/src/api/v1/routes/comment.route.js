import { Router } from "express";

import commentController from "../controllers/comment.controller.js";

const router = Router({ mergeParams: true });

router.get("/comments", commentController.getAllComments);

export default router;
