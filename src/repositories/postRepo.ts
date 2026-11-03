import { pool } from "../lib/db.js";

export type PostScope = "mine" | "others";

export type Post = {
    id: number;
    userId: number;
    title: string;
    description: string | null;
    createdAt: Date;
};

export type PostOwner = { id: number; ownerId: number };

export type PostListItem = {
    id: number;
    title: string;
    description: string | null;
    createdAt: Date;
    authorId: number;
    authorEmail: string;
    commentCount: number;
};

type ListPostsParams = {
    userId: number;
    scope: PostScope;
    limit: number;
    offset: number;
};

const COMPARISON: Record<PostScope, string> = { mine: "=", others: "<>" };

export async function create(
    userId: number,
    title: string,
    description: string | null
): Promise<Post> {
    const { rows } = await pool.query<Post>(
        `INSERT INTO posts (user_id, title, description)
         VALUES ($1, $2, $3)
         RETURNING id, user_id AS "userId", title, description, created_at AS "createdAt"`,
        [userId, title, description]
    );
    return rows[0]!;
}

export async function findById(id: number): Promise<PostOwner | undefined> {
    const { rows } = await pool.query<PostOwner>(
        `SELECT id, user_id AS "ownerId" FROM posts WHERE id = $1`,
        [id]
    );
    return rows[0];
}

export async function list({ userId, scope, limit, offset }: ListPostsParams): Promise<PostListItem[]> {
    const comparison = COMPARISON[scope];

    const { rows } = await pool.query<PostListItem>(
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

export async function remove(id: number): Promise<void> {
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);
}
