import { Router } from "express";

import userRouter from "./user.routes.js";
import blogRouter from "./blog.routes.js";

const router = Router();

router.use("/", userRouter);
router.use("/", blogRouter);

export default router;
