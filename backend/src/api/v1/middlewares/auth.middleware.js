import jwt from "../../../../utils/jwt.util.js";

const authenticateToken = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verifyAccessToken(token);

    if (!decoded) {
        return res.status(401).json({ message: "Invalid token." });
    }

    req.user = decoded;
    return next();
};

export default authenticateToken;
