import { Router } from "express";

import Blog from "../models/blog.js";

import commentRouter from "./comment.route.js";
import blogValidator from "../validators/blog.validator.js";
import paginate from "../middlewares/pagination.middleware.js";
import blogController from "../controllers/blog.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import checkOwnership from "../middlewares/ownership.middleware.js";
import queryValidationMiddleware from "../middlewares/validation.middleware.js";

const router = Router();

router.use("/blogs/:blogId", commentRouter);

router.get("/blogs", paginate(Blog), blogController.getAllBlogPosts);

router.get("/blogs/:id", blogController.getBlogPostById);

router.post(
    "/blogs",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    blogValidator.createBlogPostValidator,
    queryValidationMiddleware,
    blogController.createBlogPost
);

router.put(
    "/blogs/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    checkOwnership("blog"),
    blogValidator.updateBlogPostValidator,
    queryValidationMiddleware,
    blogController.updateBlogPostById
);

router.patch(
    "/blogs/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    checkOwnership("blog"),
    blogValidator.partiallyUpdateBlogPostValidator,
    queryValidationMiddleware,
    blogController.partiallyUpdateBlogPostById
);

router.delete(
    "/blogs/:id",
    authMiddleware.authenticateToken,
    authMiddleware.authorizeRoles(["admin"]),
    checkOwnership("blog"),
    blogValidator.deleteBlogPostValidator,
    queryValidationMiddleware,
    blogController.deleteBlogPostById
);

export default router;
