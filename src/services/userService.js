import { AppError } from "../utils/AppError.js";
import * as userRepo from "../repositories/userRepo.js";

export async function getProfile(userId) {
    const user = await userRepo.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { ...user, password: "********" };
}
