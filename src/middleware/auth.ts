import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "../utils/AppError.js";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const token: unknown = req.cookies?.token;

    if (typeof token !== "string" || !token) {
        res.status(401).json({ error: "Not logged in" });
        return;
    }

    try {
        const payload = jwt.verify(token, config.jwtSecret);

        if (typeof payload === "string" || typeof payload.id !== "number") {
            res.status(401).json({ error: "Invalid or expired token" });
            return;
        }

        req.user = { id: payload.id };
        next();
    } catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}

export function getUserId(req: Request): number {
    if (!req.user) {
        throw new AppError("Not logged in", 401);
    }
    return req.user.id;
}
