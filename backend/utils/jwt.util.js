import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET;
const refreshTokenKey = process.env.REFRESH_TOKEN_SECRET;

const generateAccessToken = (payload) =>
    jwt.sign(payload, secretKey, { expiresIn: "15m" });

const generateRefreshToken = (payload) =>
    jwt.sign(payload, refreshTokenKey, { expiresIn: "7d" });

const verifyAccessToken = (token) => {
    try {
        const tokenWithoutBearer = token.split(" ")[1];
        const decoded = jwt.verify(tokenWithoutBearer, secretKey);
        return decoded;
    } catch (error) {
        return null;
    }
};

const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, refreshTokenKey);
        return decoded;
    } catch (error) {
        return null;
    }
};

export default {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
};
