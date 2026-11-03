import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError.js";

function getField(error: unknown, key: string): unknown {
    if (typeof error === "object" && error !== null) {
        return (error as Record<string, unknown>)[key];
    }
    return undefined;
}

export function errorHandler(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
    }
    if (getField(error, "type") === "entity.parse.failed") {
        res.status(400).json({ error: "Invalid JSON body" });
        return;
    }
    if (getField(error, "code") === "23505") {
        res.status(409).json({ error: "Already exists" });
        return;
    }

    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
}
