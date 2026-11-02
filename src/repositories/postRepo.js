import { pool } from "../lib/db.js";

const COMPARISON = { mine: "=", others: "<>" };

export async function create(userId, title, description) {
    const { rows } = await pool.query(
        `INSERT INTO posts (user_id, title, description)
         VALUES ($1, $2, $3)
         RETURNING id, user_id AS "userId", title, description, created_at AS "createdAt"`,
        [userId, title, description]
    );
    return rows[0];
}

export async function findById(id) {
    const { rows } = await pool.query(
        `SELECT id, user_id AS "ownerId" FROM posts WHERE id = $1`,
        [id]
    );
    return rows[0];
}

export async function list({ userId, scope, limit, offset }) {
    const comparison = COMPARISON[scope];

    const { rows } = await pool.query(
        `SELECT p.id,
                p.title,
                p.description,
                p.created_at AS "createdAt",
                u.id         AS "authorId",
                u.email      AS "authorEmail",
                COUNT(c.id)::int AS "commentCount"
         FROM posts p
         JOIN users u ON u.id = p.user_id
         LEFT JOIN comments c ON c.post_id = p.id
         WHERE p.user_id ${comparison} $1
         GROUP BY p.id, u.id
         ORDER BY p.created_at DESC, p.id DESC
         LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
    );
    return rows;
}

export async function remove(id) {
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
}
