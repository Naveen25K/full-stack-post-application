import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { AppError } from "../utils/AppError.js";
import * as userRepo from "../repositories/userRepo.js";

function createToken(user) {
    return jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: config.jwtExpiresInSeconds,
    });
}

function normalizeEmail(email) {
    return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export async function signup(rawEmail, password) {
    const email = normalizeEmail(rawEmail);

    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }
    if (password.length < 6) {
        throw new AppError("Password must be at least 6 characters long", 400);
    }

    const existing = await userRepo.findByEmail(email);
    if (existing) {
        throw new AppError("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create(email, passwordHash);

    return { user, token: createToken(user) };
}

export async function login(rawEmail, password) {
    const email = normalizeEmail(rawEmail);

    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }

    const user = await userRepo.findByEmail(email);
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }

    return { user: { id: user.id, email: user.email }, token: createToken(user) };
}
