import { Router } from "express";

import commentRouter from "./comment.route.js";
import blogController from "../controllers/blog.controller.js";

const router = Router();

router.get("/blogs", blogController.getAllBlogPosts);

router.post("/blogs", blogController.createBlogPost);

router.get("/blogs/:id", blogController.getBlogPostById);

router.put("/blogs/:id", blogController.updateBlogPostById);

router.patch("/blogs/:id", blogController.partiallyUpdateBlogPostById);

router.delete("/blogs/:id", blogController.deleteBlogPostById);

router.use("/blogs/:blogId", commentRouter);

export default router;
