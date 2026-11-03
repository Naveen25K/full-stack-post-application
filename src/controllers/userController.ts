import type { Request, Response } from "express";
import { getUserId } from "../middleware/auth.js";
import * as userService from "../services/userService.js";

export async function getMe(req: Request, res: Response): Promise<void> {
    const profile = await userService.getProfile(getUserId(req));
    res.json(profile);
}
