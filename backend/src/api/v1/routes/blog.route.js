import { Router } from "express";

import commentRouter from "./comment.route.js";
import blogController from "../controllers/blog.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkOwnership from "../middlewares/ownership.middleware.js";

const router = Router();

router.get("/blogs", blogController.getAllBlogPosts);

router.post(
    "/blogs",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    blogController.createBlogPost
);

router.get("/blogs/:id", blogController.getBlogPostById);

router.put(
    "/blogs/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    checkOwnership("blog"),
    blogController.updateBlogPostById
);

router.patch(
    "/blogs/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    checkOwnership("blog"),
    blogController.partiallyUpdateBlogPostById
);

router.delete(
    "/blogs/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    checkOwnership("blog"),
    blogController.deleteBlogPostById
);

router.use("/blogs/:blogId", commentRouter);

export default router;
