import { AppError } from "../utils/AppError.js";

export function errorHandler(error, req, res, next) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    if (error.type === "entity.parse.failed") {
        return res.status(400).json({ error: "Invalid JSON body" });
    }
    if (error.code === "23505") {
        return res.status(409).json({ error: "Already exists" });
    }

    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
}
