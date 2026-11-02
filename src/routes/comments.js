import express from "express";
import { requireAuth } from "../middleware/auth.js";
import * as commentController from "../controllers/commentController.js";

const router = express.Router();

router.use(requireAuth);

router.delete("/:id", commentController.deleteComment);

export default router;
