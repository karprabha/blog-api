import expressAsyncHandler from "express-async-handler";

import jwt from "../../../../utils/jwt.util.js";
import authService from "../services/auth.service.js";

import RefreshToken from "../models/refreshToken.js";

const login = expressAsyncHandler(async (req, res, next) => {
    const user = await authService.authenticateUser(req.body);

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.generateAccessToken(user);
    const refreshToken = jwt.generateRefreshToken(user);

    const existingRefreshToken = await RefreshToken.findOne({
        user: user.user_id,
    });

    if (existingRefreshToken) {
        existingRefreshToken.token = refreshToken;
        await existingRefreshToken.save();
    } else {
        const refresh = new RefreshToken({
            user: user.user_id,
            token: refreshToken,
        });
        await refresh.save();
    }

    return res.json({ accessToken, refreshToken });
});

const refreshAccessToken = expressAsyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required." });
    }

    const refresh = await RefreshToken.findOne({ token: refreshToken });

    if (!refresh) {
        return res.status(401).json({ message: "Refresh token not found." });
    }

    const decoded = jwt.verifyRefreshToken(refreshToken);

    if (!decoded || decoded.user_id !== refresh.user.toJSON()) {
        return res.status(401).json({ message: "Invalid refresh token." });
    }

    const user = {
        user_id: decoded.user_id,
        first_name: decoded.first_name,
        family_name: decoded.family_name,
        username: decoded.username,
    };

    const accessToken = jwt.generateAccessToken(user);

    return res.json({ accessToken });
});

export default {
    login,
    refreshAccessToken,
};
