import * as commentService from "../services/commentService.js";
import { parseId } from "../utils/parseId.js";

export async function addComment(req, res) {
    const postId = parseId(req.params.id, "post id");
    const { content } = req.body ?? {};
    const comment = await commentService.addComment(req.user.id, postId, content);
    res.status(201).json(comment);
}

export async function listComments(req, res) {
    const postId = parseId(req.params.id, "post id");
    const comments = await commentService.listComments(postId);
    res.json(comments);
}

export async function deleteComment(req, res) {
    const commentId = parseId(req.params.id, "comment id");
    await commentService.deleteComment(req.user.id, commentId);
    res.status(204).send();
}
