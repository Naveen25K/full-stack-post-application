import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../lib/db.js";


const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
    try {
        const sql = await fs.readFile(path.join(__dirname, "schema.sql"), "utf-8");
        await pool.query(sql);
        console.log("Migration done");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await pool.end();
    }
}

migrate();
