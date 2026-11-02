import express from "express";
import { requireAuth } from "../middleware/auth.js";
import * as postController from "../controllers/postController.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", postController.createPost);
router.get("/", postController.listPosts);
router.delete("/:id", postController.deletePost);

router.post("/:id/comments", commentController.addComment);
router.get("/:id/comments", commentController.listComments);

export default router;
