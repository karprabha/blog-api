import { Router } from "express";

import blogController from "../controllers/blog.controller.js";

const router = Router();

router.get("/blogs", blogController.getAllBlogs);

router.get("/blog/:id", blogController.getBlogDetail);

export default router;
