import { AppError } from "./AppError.js";

export function parseId(value: unknown, label = "id"): number {
    const id = Number(value);

    if (!Number.isInteger(id) || id < 1) {
        throw new AppError(`Invalid ${label}`, 400);
    }

    return id;
}
