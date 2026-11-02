import { AppError } from "../utils/AppError.js";
import * as postRepo from "../repositories/postRepo.js";

export async function createPost(userId, title, description) {
    if (typeof title !== "string" || !title.trim()) {
        throw new AppError("Title is required", 400);
    }
    if (title.trim().length > 255) {
        throw new AppError("Title must be 255 characters or less", 400);
    }
    if (description != null && typeof description !== "string") {
        throw new AppError("Description must be text", 400);
    }

    return postRepo.create(userId, title.trim(), description ?? null);
}

export async function listPosts(userId, { scope, page, limit }) {
    if (scope !== "mine" && scope !== "others") {
        throw new AppError("scope must be 'mine' or 'others'", 400);
    }

    const safePage = Math.max(Number.parseInt(page) || 1, 1);
    const safeLimit = Math.min(Math.max(Number.parseInt(limit) || 10, 1), 50);
    const offset = (safePage - 1) * safeLimit;

    return postRepo.list({ userId, scope, limit: safeLimit, offset });
}

export async function deletePost(userId, postId) {
    const post = await postRepo.findById(postId);

    if (!post) {
        throw new AppError("Post not found", 404);
    }
    if (post.ownerId !== userId) {
        throw new AppError("You are not authorized to delete this post", 403);
    }

    await postRepo.remove(postId);
}
