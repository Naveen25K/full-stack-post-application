import type { Request, Response } from "express";
import { getUserId } from "../middleware/auth.js";
import * as postService from "../services/postService.js";
import { parseId } from "../utils/parseId.js";

export async function createPost(req: Request, res: Response): Promise<void> {
    const { title, description } = req.body ?? {};
    const post = await postService.createPost(getUserId(req), title, description);
    res.status(201).json(post);
}

export async function listPosts(req: Request, res: Response): Promise<void> {
    const { scope, page, limit } = req.query;
    const posts = await postService.listPosts(getUserId(req), { scope, page, limit });
    res.json(posts);
}

export async function deletePost(req: Request, res: Response): Promise<void> {
    const postId = parseId(req.params.id, "post id");
    await postService.deletePost(getUserId(req), postId);
    res.status(204).send();
}
