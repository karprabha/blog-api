import User from "../models/user.js";
import jwt from "../../../../utils/jwt.util.js";

const authenticateToken = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token." });
        }

        const user = await User.findById(
            decoded.user_id,
            "first_name family_name username role"
        );

        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        const { _id, first_name, family_name, username, role } = user;
        req.user = {
            id: _id.toString(),
            first_name,
            family_name,
            username,
            role,
        };
        return next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};

const authorizeRoles = (allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
        return res
            .status(403)
            .json({ message: "Access denied. Insufficient permissions." });
    }

    return next();
};

export default { authenticateToken, authorizeRoles };
