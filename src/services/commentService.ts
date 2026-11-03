import { AppError } from "../utils/AppError.js";
import * as postRepo from "../repositories/postRepo.js";
import * as commentRepo from "../repositories/commentRepo.js";

async function assertPostExists(postId: number): Promise<void> {
    const post = await postRepo.findById(postId);
    if (!post) {
        throw new AppError("Post not found", 404);
    }
}

export async function addComment(
    userId: number,
    postId: number,
    content: unknown
): Promise<commentRepo.Comment> {
    if (typeof content !== "string" || !content.trim()) {
        throw new AppError("Comment can not be empty", 400);
    }

    await assertPostExists(postId);

    return commentRepo.create(postId, userId, content.trim());
}

export async function listComments(postId: number): Promise<commentRepo.CommentListItem[]> {
    await assertPostExists(postId);

    return commentRepo.listByPost(postId);
}

export async function deleteComment(userId: number, commentId: number): Promise<void> {
    const comment = await commentRepo.findWithPostOwner(commentId);

    if (!comment) {
        throw new AppError("Comment not found", 404);
    }

    const isPostOwner = comment.postOwnerId === userId;
    const isCommentAuthor = comment.authorId === userId;

    if (!isPostOwner && !isCommentAuthor) {
        throw new AppError("You can not delete this comment", 403);
    }

    await commentRepo.remove(commentId);
}
