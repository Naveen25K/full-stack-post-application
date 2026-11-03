import { AppError } from "../utils/AppError.js";
import * as postRepo from "../repositories/postRepo.js";

type ListQuery = { scope: unknown; page: unknown; limit: unknown };

export async function createPost(
    userId: number,
    title: unknown,
    description: unknown
): Promise<postRepo.Post> {
    if (typeof title !== "string" || !title.trim()) {
        throw new AppError("Title is required", 400);
    }
    if (title.trim().length > 255) {
        throw new AppError("Title must be 255 characters or less", 400);
    }
    if (description != null && typeof description !== "string") {
        throw new AppError("Description must be text", 400);
    }

    const cleanDescription = typeof description === "string" ? description : null;

    return postRepo.create(userId, title.trim(), cleanDescription);
}

export async function listPosts(userId: number, query: ListQuery): Promise<postRepo.PostListItem[]> {
    const { scope } = query;

    if (scope !== "mine" && scope !== "others") {
        throw new AppError("scope must be 'mine' or 'others'", 400);
    }

    const page = Math.max(Number.parseInt(String(query.page)) || 1, 1);
    const limit = Math.min(Math.max(Number.parseInt(String(query.limit)) || 10, 1), 50);
    const offset = (page - 1) * limit;

    return postRepo.list({ userId, scope, limit, offset });
}

export async function deletePost(userId: number, postId: number): Promise<void> {
    const post = await postRepo.findById(postId);

    if (!post) {
        throw new AppError("Post not found", 404);
    }
    if (post.ownerId !== userId) {
        throw new AppError("You are not authorized to delete this post", 403);
    }

    await postRepo.remove(postId);
}
