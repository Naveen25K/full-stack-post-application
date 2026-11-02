import express from "express";
import { requireAuth } from "../middleware/auth.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

router.get("/me", requireAuth, userController.getMe);

export default router;
