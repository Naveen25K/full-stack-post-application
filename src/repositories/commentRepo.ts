import { pool } from "../lib/db.js";

export type Comment = {
    id: number;
    postId: number;
    userId: number;
    content: string;
    createdAt: Date;
};

export type CommentListItem = {
    id: number;
    content: string;
    createdAt: Date;
    authorId: number;
    authorEmail: string;
};

export type CommentWithPostOwner = { authorId: number; postOwnerId: number };

export async function create(postId: number, userId: number, content: string): Promise<Comment> {
    const { rows } = await pool.query<Comment>(
        `INSERT INTO comments (post_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, post_id AS "postId", user_id AS "userId", content, created_at AS "createdAt"`,
        [postId, userId, content]
    );
    return rows[0]!;
}

export async function listByPost(postId: number): Promise<CommentListItem[]> {
    const { rows } = await pool.query<CommentListItem>(
        `SELECT c.id,
                c.content,
                c.created_at AS "createdAt",
                u.id         AS "authorId",
                u.email      AS "authorEmail"
         FROM comments c
         JOIN users u ON u.id = c.user_id
         WHERE c.post_id = $1
         ORDER BY c.created_at ASC`,
        [postId]
    );
    return rows;
}

export async function findWithPostOwner(commentId: number): Promise<CommentWithPostOwner | undefined> {
    const { rows } = await pool.query<CommentWithPostOwner>(
        `SELECT c.user_id AS "authorId",
                p.user_id AS "postOwnerId"
         FROM comments c
         JOIN posts p ON p.id = c.post_id
         WHERE c.id = $1`,
        [commentId]
    );
    return rows[0];
}

export async function remove(id: number): Promise<void> {
    await pool.query("DELETE FROM comments WHERE id = $1", [id]);
}
