import type { Request, Response } from "express";
import { config } from "../config/index.js";
import * as authService from "../services/authService.js";

const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
} as const;

export async function signup(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body ?? {};

    const { user, token } = await authService.signup(email, password);

    res.cookie("token", token, {
        ...cookieOptions,
        maxAge: config.jwtExpiresInSeconds * 1000,
    });
    res.status(201).json(user);
}

export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body ?? {};

    const { user, token } = await authService.login(email, password);

    res.cookie("token", token, {
        ...cookieOptions,
        maxAge: config.jwtExpiresInSeconds * 1000,
    });
    res.json(user);
}

export function logout(req: Request, res: Response): void {
    res.clearCookie("token", cookieOptions);
    res.json({ message: "Logged out" });
}
