import { pool } from "../lib/db.js";

export async function findByEmail(email) {
    const { rows } = await pool.query(
        `SELECT id, email, password_hash AS "passwordHash"
         FROM users
         WHERE email = $1`,
        [email]
    );
    return rows[0];
}

export async function findById(id) {
    const { rows } = await pool.query(
        `SELECT id, email, created_at AS "createdAt"
         FROM users
         WHERE id = $1`,
        [id]
    );
    return rows[0];
}

export async function create(email, passwordHash) {
    const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash)
         VALUES ($1, $2)
         RETURNING id, email`,
        [email, passwordHash]
    );
    return rows[0];
}
