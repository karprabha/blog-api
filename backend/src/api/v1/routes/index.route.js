import { Router } from "express";

import userRouter from "./user.route.js";
import blogRouter from "./blog.route.js";

const router = Router();

router.use("/", userRouter);
router.use("/", blogRouter);

export default router;
