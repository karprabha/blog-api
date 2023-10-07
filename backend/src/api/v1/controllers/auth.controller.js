import expressAsyncHandler from "express-async-handler";

import jwt from "../../../../utils/jwt.util.js";
import authService from "../services/auth.service.js";

const login = expressAsyncHandler(async (req, res, next) => {
    const user = await authService.authenticateUser(req.body);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    return res.json({ accessToken, refreshToken });
});

const refreshAccessToken = expressAsyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required." });
    }

    const decoded = jwt.verifyRefreshToken(refreshToken);

    if (!decoded || !decoded.userId) {
        return res.status(401).json({ message: "Invalid refresh token." });
    }

    const accessToken = jwt.generateAccessToken({ userId: decoded.userId });

    return res.json({ accessToken });
});

export default {
    login,
    refreshAccessToken,
};
