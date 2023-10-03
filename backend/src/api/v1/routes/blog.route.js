import { Router } from "express";

import blogController from "../controllers/blog.controller.js";

const router = Router();

router.get("/blogs", blogController.getAllBlogPosts);

router.post("/blogs", blogController.createBlogPost);

router.get("/blogs/:id", blogController.getBlogPostById);

router.put("/blogs/:id", blogController.updateBlogPostById);

export default router;
