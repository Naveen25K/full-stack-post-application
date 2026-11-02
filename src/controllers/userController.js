import * as userService from "../services/userService.js";

export async function getMe(req, res) {
    const profile = await userService.getProfile(req.user.id);
    res.json(profile);
}
