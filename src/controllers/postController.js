import * as postService from "../services/postService.js";
import { parseId } from "../utils/parseId.js";

export async function createPost(req, res) {
    const { title, description } = req.body ?? {};
    const post = await postService.createPost(req.user.id, title, description);
    res.status(201).json(post);
}

export async function listPosts(req, res) {
    const { scope, page, limit } = req.query;
    const posts = await postService.listPosts(req.user.id, { scope, page, limit });
    res.json(posts);
}

export async function deletePost(req, res) {
    const postId = parseId(req.params.id, "post id");
    await postService.deletePost(req.user.id, postId);
    res.status(204).send();
}
