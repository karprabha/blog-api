import expressAsyncHandler from "express-async-handler";

import RefreshToken from "../models/refreshToken.js";

import jwt from "../../../../utils/jwt.util.js";
import authService from "../services/auth.service.js";
import cookieOptions from "../../../../config/cookie.config.js";

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

    return res
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json({ accessToken });
});

const logout = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required." });
    }

    try {
        const deletedToken = await RefreshToken.findOneAndDelete({
            token: refreshToken,
        });

        if (!deletedToken) {
            return res.status(404).json({ message: "Token not found." });
        }

        console.log(`User with ID ${deletedToken.user} logged out.`);

        return res
            .clearCookie("refreshToken", cookieOptions)
            .status(200)
            .json({ message: "Logout successful." });
    } catch (error) {
        console.error("Logout error:", error);

        return res.status(500).json({ message: "Internal server error." });
    }
};

const refreshAccessToken = expressAsyncHandler(async (req, res, next) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required." });
    }

    const refresh = await RefreshToken.findOne({ token: refreshToken });

    if (!refresh) {
        return res.status(401).json({ message: "Refresh token not found." });
    }

    const decoded = jwt.verifyRefreshToken(refreshToken);

    if (!decoded || decoded.user_id !== refresh.user.toString()) {
        return res.status(401).json({ message: "Invalid refresh token." });
    }

    const user = { user_id: decoded.user_id };

    const accessToken = jwt.generateAccessToken(user);

    return res.json({ accessToken });
});

export default {
    login,
    logout,
    refreshAccessToken,
};
