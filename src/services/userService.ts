import { AppError } from "../utils/AppError.js";
import * as userRepo from "../repositories/userRepo.js";

type Profile = userRepo.UserProfile & { password: string };

export async function getProfile(userId: number): Promise<Profile> {
    const user = await userRepo.findById(userId);

    if (!user) {
        throw new AppError("User not found", 404);
    }

    return { ...user, password: "********" };
}
