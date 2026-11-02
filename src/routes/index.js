import express from 'express';
import authRoutes from "./auth.js";
import userRouter from "./users.js";
import PostRoutes from "./posts.js";
import CommentRoutes from "./comments.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRouter);
router.use("/posts", PostRoutes);
router.use("/comments", CommentRoutes);

export default router;