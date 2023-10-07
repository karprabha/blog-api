import { Router } from "express";

import commentRouter from "./comment.route.js";
import blogController from "../controllers/blog.controller.js";
import authenticateToken from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/blogs", blogController.getAllBlogPosts);

router.post("/blogs", authenticateToken, blogController.createBlogPost);

router.get("/blogs/:id", blogController.getBlogPostById);

router.put("/blogs/:id", authenticateToken, blogController.updateBlogPostById);

router.patch(
    "/blogs/:id",
    authenticateToken,
    blogController.partiallyUpdateBlogPostById
);

router.delete(
    "/blogs/:id",
    authenticateToken,
    blogController.deleteBlogPostById
);

router.use("/blogs/:blogId", commentRouter);

export default router;
