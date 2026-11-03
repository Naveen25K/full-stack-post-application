import { pool } from "../lib/db.js";

export type UserCredentials = { id: number; email: string; passwordHash: string };
export type UserProfile = { id: number; email: string; createdAt: Date };
export type NewUser = { id: number; email: string };

export async function findByEmail(email: string): Promise<UserCredentials | undefined> {
    const { rows } = await pool.query<UserCredentials>(
        `SELECT id, email, password_hash AS "passwordHash"
         FROM users
         WHERE email = $1`,
        [email]
    );
    return rows[0];
}

export async function findById(id: number): Promise<UserProfile | undefined> {
    const { rows } = await pool.query<UserProfile>(
        `SELECT id, email, created_at AS "createdAt"
         FROM users
         WHERE id = $1`,
        [id]
    );
    return rows[0];
}

export async function create(email: string, passwordHash: string): Promise<NewUser> {
    const { rows } = await pool.query<NewUser>(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email`,
        [email, passwordHash]
    );
    return rows[0]!;
}
