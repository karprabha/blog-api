import { Router } from "express";

import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";
import blogRouter from "./blog.route.js";
import uploadRouter from "./upload.route.js";

const router = Router();

router.use("/", authRouter);
router.use("/", userRouter);
router.use("/", blogRouter);
router.use("/", uploadRouter);

export default router;
