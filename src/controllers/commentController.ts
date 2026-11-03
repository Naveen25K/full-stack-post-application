import type { Request, Response } from "express";
import { getUserId } from "../middleware/auth.js";
import * as commentService from "../services/commentService.js";
import { parseId } from "../utils/parseId.js";

export async function addComment(req: Request, res: Response): Promise<void> {
    const postId = parseId(req.params.id, "post id");
    const { content } = req.body ?? {};
    const comment = await commentService.addComment(getUserId(req), postId, content);
    res.status(201).json(comment);
}

export async function listComments(req: Request, res: Response): Promise<void> {
    const postId = parseId(req.params.id, "post id");
    const comments = await commentService.listComments(postId);
    res.json(comments);
}

export async function deleteComment(req: Request, res: Response): Promise<void> {
    const commentId = parseId(req.params.id, "comment id");
    await commentService.deleteComment(getUserId(req), commentId);
    res.status(204).send();
}
