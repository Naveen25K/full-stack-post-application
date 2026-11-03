import { pool } from "../lib/db.js";

export async function create(postId, userId, content) {
    const { rows } = await pool.query(
        `INSERT INTO comments (post_id, user_id, content)
         VALUES ($1, $2, $3)
         RETURNING id, post_id AS "postId", user_id AS "userId", content, created_at AS "createdAt"`,
        [postId, userId, content]
    );
    return rows[0];
}
  
export async function listByPost(postId) {
    const { rows } = await pool.query(
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

export async function findWithPostOwner(commentId) {
    const { rows } = await pool.query(
        `SELECT c.user_id AS "authorId",
                p.user_id AS "postOwnerId"
         FROM comments c
         JOIN posts p ON p.id = c.post_id
         WHERE c.id = $1`,
        [commentId]
    );
    return rows[0];
}

export async function remove(id) {
    await pool.query("DELETE FROM comments WHERE id = $1", [id]);
}
